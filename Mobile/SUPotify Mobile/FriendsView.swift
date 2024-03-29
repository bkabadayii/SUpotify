import SwiftUI

struct FriendsView: View {
    @State private var newFriendUsername = ""
    @State private var friends = [String]()
    let username: String
    @State private var refreshID = UUID()
    @State private var isRotated = false
    @State private var listKey = UUID()
    @State var notExist: Bool = false
    let myUsername = SessionManager.shared.username
    @State var giveAlert: Bool = false
    @State var isToggled: Bool = true
    @State var isBlocked: Bool = true
    @State private var friendsToggleStates = [String: Bool]()
    @State private var friendsBlockedStatus = [String: Bool]()
    @State private var showAlert = false
    @State private var alertMessage: String = ""
    @State private var alertMessager: String = ""
    
    init() {
        self.username = SessionManager.shared.username
        fetchBlockedUsers()
        fetchFollowedUsers()
    }


    var body: some View {
        
        ScrollView{

                HStack {
                    TextField("Enter username", text: $newFriendUsername)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding()
                        .font(.caption)
                        .autocapitalization(.none)
                    
                    Button(action: {
                        if(newFriendUsername == myUsername){
                            giveAlert = true
                            alertMessager = "You cannot add yourself as a friend"
                        }
                        self.addFriend(friendUsername: self.newFriendUsername)
                       
                    }) {
                        Text("Add")
                            .foregroundColor(.white)
                            .padding(.horizontal)
                            .padding(.vertical, 8)
                            .background(Color.indigo.opacity(0.50))
                            .cornerRadius(8)
                            .font(.subheadline)
                            .alert(isPresented: $giveAlert) {
                                Alert(
                                    title: Text("Cannot add friend"),
                                    message: Text(alertMessager),
                                    dismissButton: .default(Text("OK"))
                                )
                            }
                    }
                    .padding()
                }
               
                        ForEach(friends, id: \.self) { friend in
                        
                                HStack{
                                    Image(systemName: "person.circle.fill")
                                        .resizable()
                                        .aspectRatio(contentMode: .fit)
                                        .frame(width: 45, height: 45)
                                        .foregroundColor(.indigo.opacity(0.70))
                                        .padding()
                                    Text(friend)
                                        .font(.subheadline)
                                    Spacer()
                                    Button(action: {
                                        removeFollower(friendUsername: friend)
                                    }) {
                                        Image(systemName: "person.badge.minus.fill")
                                            .resizable()
                                            .frame(width: 30, height: 30)
                                            .foregroundColor(.white.opacity(0.50))
                                    }
                                     

                                           Button(friendsBlockedStatus[friend] == true ? "Unblock" : "Block") {
                                               if friendsBlockedStatus[friend] == true {
                                                   unblock(friendUsername: friend)
                                               } else {
                                                   blockRecommendationForUser(friendUsername: friend)
                                               }
                                           }
                                           .padding()
                                           .background(Color.red)
                                           .foregroundColor(.white)
                                           .font(.caption2)
                                           .cornerRadius(8)
                                           .alert(isPresented: $showAlert) {
                                                       Alert(
                                                           title: Text("Success"),
                                                           message: Text(alertMessage),
                                                           dismissButton: .default(Text("OK"))
                                                       )
                                                   }
                                }
                                
                        
                            }
        }
       
        .id(refreshID)
        .onAppear(perform: {
            fetchFollowedUsers()
            fetchBlockedUsers()
        })
    }
    
    
    
    func addFriend(friendUsername: String) {
        
        let token = SessionManager.shared.token
        let trimmedUsername = friendUsername.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmedUsername.isEmpty {
            let url = URL(string: "http://localhost:4000/api/followedUsers/addToUserFollowedUsers")!
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue( "Bearer \(token)", forHTTPHeaderField: "Authorization")
            
            let body: [String: Any] = ["followedUsername": trimmedUsername]
            request.httpBody = try? JSONSerialization.data(withJSONObject: body)
            
            URLSession.shared.dataTask(with: request) { data, response, error in
                DispatchQueue.main.async {
                    if let error = error {
                        
                        print(error.localizedDescription)
                        return
                    }
                    guard let data = data else {
                        return
                    }
                    do {
                        let response = try JSONDecoder().decode(FollowedUsersResponse.self, from: data)
                        if response.success {
                            self.friends.append(trimmedUsername)
                            print(response)
                        } else if (response.message == "This user does not exist!"){
                            print(response.message)
                            giveAlert = true
                            alertMessager = response.message
                        }
                        else if (response.message == "Followed username already exists in user followed users list!"){
                            print(response.message)
                            giveAlert = true
                            alertMessager = response.message
                        }
                    } catch {
                        print("Decoding error!")
                    }
                    fetchFollowedUsers()
                }
            }.resume()
        }
        newFriendUsername = ""
    }
    
    
    func removeFollower(friendUsername: String) {
        let token = SessionManager.shared.token
        let url = URL(string: "http://localhost:4000/api/followedUsers/removeFromUserFollowedUsers")!
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let trimmedUsername = friendUsername.trimmingCharacters(in: .whitespacesAndNewlines)
        print(trimmedUsername)
        
        let body: [String: Any] = ["followedUsername": trimmedUsername]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let data = data, let responseString = String(data: data, encoding: .utf8) {
                    print("Response String: \(responseString)")
                }
                if let error = error {
                    print(error.localizedDescription)
                    return
                }
                guard let data = data else {
                    print("No data received")
                    return
                }
               do {
                    let response = try JSONDecoder().decode(RemoveUserResponse.self, from: data)
                    if response.message == "User is removed from followed users successfully" {
                        self.friends = response.updatedFollowedUsers.followedUsersList
                    } else {
                        print("Failed to remove friend: \(response.message)")
                    }
                } catch {
                    print("Decoding error: \(error)")
                }
                fetchFollowedUsers()
            }
        }.resume()
    }
    
    func fetchFollowedUsers() {
            let token = SessionManager.shared.token
            let url = URL(string: "http://localhost:4000/api/followedUsers/getAllFollowedUsersForUser")!
            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

            URLSession.shared.dataTask(with: request) { data, response, error in
                DispatchQueue.main.async {
                    if let error = error {
                        print("Fetch error: \(error.localizedDescription)")
                        return
                    }
                    guard let data = data else {
                        print("No data received")
                        return
                    }
                    do {
                        let response = try JSONDecoder().decode(FollowedUsersListResponse.self, from: data)
                        if response.success {
                            self.friends = response.followedUsers
                            self.refreshID = UUID()
                            
                        } else {
                            print("Fetch failed: \(response.message)")
                        }
                    } catch {
                        print("Decoding error: \(error)")
                    }
                    self.listKey = UUID()
                }
                
            }.resume()
        
}
    
    func fetchBlockedUsers() {
        let token = SessionManager.shared.token
        let url = URL(string: "http://localhost:4000/api/followedUsers/getBlockedUsers")!
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    print("Fetch blocked users error: \(error.localizedDescription)")
                    return
                }
                guard let data = data else {
                    print("No data received")
                    return
                }
                do {
                    let response = try JSONDecoder().decode(BlockedUsersResponse.self, from: data)
                    if (response.message == "Returned blocked users successfully") {
                        // Update the friendsBlockedStatus based on response
                        for friend in friends {
                            friendsBlockedStatus[friend] = response.blockedUsers.contains(friend)
                        }
                    } else {
                        print("Fetch failed: \(response.message)")
                    }
                } catch {
                    print("Decoding error: \(error)")
                }
            }
        }.resume()
    }
    
    func blockRecommendationForUser(friendUsername: String) {
          let token = SessionManager.shared.token
          let url = URL(string: "http://localhost:4000/api/followedUsers/recommendationBlockUser")!
          var request = URLRequest(url: url)
          request.httpMethod = "POST"
          request.setValue("application/json", forHTTPHeaderField: "Content-Type")
          request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
          
          let body: [String: Any] = ["blockedUsername": friendUsername]
          request.httpBody = try? JSONSerialization.data(withJSONObject: body)
          
          URLSession.shared.dataTask(with: request) { data, response, error in
              DispatchQueue.main.async {
                  if let error = error {
                      print("Block recommendation error: \(error.localizedDescription)")
                      return
                  }
                  guard let data = data else {
                      print("No data received")
                      return
                  }
                  do {
                      let response = try JSONDecoder().decode(BlockRecommendationResponse.self, from: data)
                      if response.success {
                          self.friendsBlockedStatus[friendUsername] = true
                          self.alertMessage = "\(friendUsername) successfully blocked. \(friendUsername) will not get any recommendations from you."
                          self.showAlert = true
                          print("Recommendations blocked for user: \(friendUsername)")
                          isBlocked = true
                      } else {
                          print(response)
                          self.friendsBlockedStatus[friendUsername] = false
                          print("Failed to block recommendations for user: \(friendUsername)")
                      }
                  } catch {
                      print("Decoding error: \(error)")
                  }
              }
          }.resume()
      }
    
    func unblock(friendUsername: String) {
          let token = SessionManager.shared.token
          let url = URL(string: "http://localhost:4000/api/followedUsers/recommendationUnblockUser")!
          var request = URLRequest(url: url)
          request.httpMethod = "DELETE"
          request.setValue("application/json", forHTTPHeaderField: "Content-Type")
          request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
          
          let body: [String: Any] = ["blockedUsername": friendUsername]
          request.httpBody = try? JSONSerialization.data(withJSONObject: body)
          
          URLSession.shared.dataTask(with: request) { data, response, error in
              DispatchQueue.main.async {
                  if let error = error {
                      print("Unblock recommendation error: \(error.localizedDescription)")
                      return
                  }
                  guard let data = data else {
                      print("No data received")
                      return
                  }
                  do {
                      let response = try JSONDecoder().decode(UnblockUserResponse.self, from: data)
                      if response.message == "User unblocked successfully" {
                          self.friendsBlockedStatus[friendUsername] = false
                          self.alertMessage = "\(friendUsername) successfully unblocked. \(friendUsername) now can get recommendations from you."
                          self.showAlert = true
                          print("Recommendations unblocked for user: \(friendUsername)")
                          isBlocked = false
                          
                      } else {
                          print(response)
                          self.friendsBlockedStatus[friendUsername] = true
                          print("Failed to unblock recommendations for user: \(friendUsername)")
                      }
                  } catch {
                      print("Decoding error: \(error)")
                  }
              }
          }.resume()
      }

    struct UnblockUserResponse: Codable {
        let message: String
        let updatedBlockedUsers: UpdatedBlockedUsers
    }
    
    struct UpdatedBlockedUsers: Codable {
        let _id: String
        let username: String
        let followedUsersList: [String]
       // let __v: Int
        let recommendationBlockedUsersList: [String]
    }

    struct FollowedUsersResponse: Codable {
        let message: String
        let success: Bool
    }


    struct FollowedUsersListResponse: Codable {
        let message: String
        let success: Bool
        let followedUsers: [String]
    }
    
    struct RemoveUserResponse: Codable{
        let message: String
        let updatedFollowedUsers: UpdatedFollowedUsers
    }
    

    struct UpdatedFollowedUsers: Codable {
        let id: String
        let username: String
        let followedUsersList: [String]
        let __v: Int
    }
    
    struct BlockRecommendationResponse: Codable {
        let message: String
        let success: Bool
    }
    
    struct BlockedUsersResponse: Codable {
        let message: String
        let blockedUsers: [String]
        let unblockedUsers:[String]
        let allFollowers: [String]
    }
    
}

struct FriendsView_Previews: PreviewProvider {
    static var previews: some View {
        FriendsView()
            .preferredColorScheme(.dark)
    }
}
