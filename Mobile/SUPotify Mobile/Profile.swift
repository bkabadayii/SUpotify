
import SwiftUI

struct Profile: View {
    @State private var showingAlert = false
    @State private var isLogoutSuccessful = false
    @State private var errorMessage: String?
    @State private var numberOfPlaylists = 0
    @State private var numberOfFriends = 0

    var username = SessionManager.shared.username
    
    func logout() {
        let body: [String: String] = ["username": username]
        
        guard let jsonData = try? JSONSerialization.data(withJSONObject: body),
              let url = URL(string: "http://localhost:4000/auth/logout") else {
            DispatchQueue.main.async {
                errorMessage = "Invalid URL or body"
                showingAlert = true
            }
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.httpBody = jsonData
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    self.errorMessage = error.localizedDescription
                    self.showingAlert = true
                    return
                }
                
                guard let data = data,
                      let decodedResponse = try? JSONDecoder().decode(LogoutResponse.self, from: data),
                      decodedResponse.success else {
                    self.errorMessage = "Failed to decode response or logout was unsuccessful"
                    self.showingAlert = true
                    return
                }
                
                self.errorMessage = nil
                self.isLogoutSuccessful = true
            }
        }.resume()
    }
    
    @State private var selectedTab = 0
    @State private var mycolor = ""

    
    var body: some View {
        NavigationView {
            ZStack {
                ScrollView {
                    VStack {
                        HStack {
                            Spacer()
                            Button("Logout") {
                                logout()
                            }
                            .font(.system(size: 14, weight:.medium))
                            .foregroundColor(.red)
                            .padding(.trailing, 30)
                            .alert(isPresented: $showingAlert) {
                                Alert(title: Text("Error"), message: Text(errorMessage ?? "Could not log out"), dismissButton: .default(Text("OK")))
                            }
                        }
                        Spacer()
                        
                        
                        HStack {
                            VStack(alignment: .leading, spacing: 9) {
                                Text("\(username)")
                                    .font(.title)
                                    .foregroundColor(.white)
                                    .fontWeight(.bold)
                                /*HStack(spacing: 10) {
                                        //Text("\(playlists.count) Playlists")
                                        //Text("\(friends.count) Friends")
                                    
                                    }
                                    .font(.subheadline)*/
                            }
                                .padding(.horizontal, 16)
                            
                            Spacer()
                            
                            Image(systemName: "person.circle.fill")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 80, height: 80)
                                .foregroundColor(.indigo)
                                .padding()
                        }
                        .padding(.top, 16)
                        .padding(.horizontal, 16)
                        
                       
                        
                        Picker("Options", selection: $selectedTab) {
                                               Text("Playlists").tag(0)
                                               Text("Friends").tag(1)
                            }
                            .pickerStyle(SegmentedPickerStyle())
                            .padding()

                            // Display content based on selected tab
                            if selectedTab == 0 {
                               PlaylistGrid()
                                
                            } else {
                                FriendsView()
                            }
                    }
                }
                    
            }
            .navigationBarTitle("Profile")
            //.navigationTitle("Profile")
            //.navigationBarHidden(isLogoutSuccessful)
            .background(NavigationLink("", destination: ContentView(), isActive: $isLogoutSuccessful))
        }
    }
}

struct LogoutResponse: Codable {
    let message: String
    let success: Bool
}

struct Profile_Previews: PreviewProvider {
    static var previews: some View {
        Profile().preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
    }
}


