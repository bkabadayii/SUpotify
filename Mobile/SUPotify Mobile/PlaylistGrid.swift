import SwiftUI

struct PlaylistGrid: View {
    @State private var playlists = [Playlist]()
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var createPlaylist = false
    @State private var isRotated:Bool = false
    @State private var toDelete:Bool = false
    @State private var showingDeleteAlert = false
    @State private var selectedPlaylistId: String = ""
    @State private var addSongs = false
    @EnvironmentObject var viewModel: LikedSongsViewModel
    @State private var playlistView:Bool = false
    @ObservedObject var viewModel2 = SharedViewModel()
    

    let layout = [GridItem(.flexible()), GridItem(.flexible())]
    
    init() {
        self.viewModel2.fetchPlaylists()
    }

    var body: some View {
        VStack(alignment: .leading) {
            HStack {
                Button(action: {
                    createPlaylist = true
                }) {
                    Label("Create a playlist", systemImage: "plus.circle.fill")
                        .foregroundColor(.indigo)
                        .labelStyle(.titleAndIcon)
                        .font(.subheadline)
                }
                
                Spacer()
            }
            .padding()

            NavigationLink(destination: CreatePlaylistView(), isActive: $createPlaylist) {
                EmptyView()
            }
            

            ScrollView {
                LazyVGrid(columns: layout, spacing: 20) {
                    ForEach(playlists, id: \._id) { playlist in
                        VStack {
                            
                            
                            NavigationLink(destination: PlaylistView(playlistID: playlist._id)) {
                                Image(systemName: "music.note.list")
                                    .resizable()
                                    .scaledToFit()
                                    .frame(width: 100, height: 100)
                                    .padding()
                                    .background(Color.gray.opacity(0.3))
                                    .cornerRadius(10)
                                    .foregroundColor(.indigo)
                            }
                        
                            Text(playlist.name)
                              .font(.headline)
                              .foregroundColor(.indigo)
                              .frame(width: 100, height: 20, alignment: .center) // Set a fixed frame
                              .lineLimit(1) // Ensure text stays within one line
                              .truncationMode(.tail) // Truncate at the tail if too long

                                Text("\(playlist.tracks.count) Songs")
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                            
                            
                            
                            Button(action: {
                                self.selectedPlaylistId = playlist._id
                                self.showingDeleteAlert = true
                            }) {
                                Label("Delete", systemImage: "minus.circle.fill")
                                    .foregroundColor(.red)
                                    .labelStyle(.titleAndIcon)
                                    .font(.footnote)
                            }
                            .alert(isPresented: $showingDeleteAlert) {
                                Alert(
                                    title: Text("Delete Playlist"),
                                    message: Text("Are you sure you want to delete this playlist?"),
                                    primaryButton: .destructive(Text("Delete")) {
                                        deletePlaylist(playlistId: selectedPlaylistId)
                                    },
                                    secondaryButton: .cancel()
                                )
                            }
                        }
                        .padding()
                        .background(Color.black.opacity(0.50))
                        .cornerRadius(12)
                        .shadow(radius: 5)
                    }

                }
                .padding()
            }
        }
        .padding(.horizontal)
        .onAppear(perform: fetchPlaylists)
    }

   private func fetchPlaylists() {
        let baseURL = "http://localhost:4000/api/playlists/getUserPlaylists"
        let token = SessionManager.shared.token

        guard let url = URL(string: baseURL) else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false

                if let error = error {
                    print("Network error: \(error.localizedDescription)")
                    errorMessage = error.localizedDescription
                    return
                }

                guard let data = data else {
                    print("No data received")
                    errorMessage = "No data received"
                    return
                }

                do {
                    let response = try JSONDecoder().decode(PlaylistResponse.self, from: data)
                    if response.success {
                        self.playlists = response.userToPlaylists.playlists
                        print(self.playlists)
                    } else {
                        errorMessage = response.message
                    }
                } catch {
                    print("Decoding error: \(error)")
                    errorMessage = "Failed to decode response"
                }
            }
        }.resume()
    }
    
    private func deletePlaylist(playlistId: String) {
          let baseURL = "http://localhost:4000/api/playlists/deletePlaylist"
          let token = SessionManager.shared.token

          guard let url = URL(string: baseURL) else { return }

          var request = URLRequest(url: url)
          request.httpMethod = "DELETE"
          request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
          request.setValue("application/json", forHTTPHeaderField: "Content-Type")
          request.httpBody = try? JSONEncoder().encode(["playlistID": playlistId])

          URLSession.shared.dataTask(with: request) { data, response, error in
              DispatchQueue.main.async {
                  if let error = error {
                      print("Network error: \(error.localizedDescription)")
                      errorMessage = error.localizedDescription
                      return
                  }
                  self.playlists.removeAll { $0._id == playlistId }
              }
          }.resume()
      }
    
    
}

class SharedViewModel: ObservableObject {
    @Published var playlists = [Playlist]()
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var createPlaylist = false
    @State private var isRotated:Bool = false
    @State private var toDelete:Bool = false
    @State private var showingDeleteAlert = false
    @Published private var selectedPlaylistId: String = ""
    @State private var addSongs = false
    @EnvironmentObject var viewModel: LikedSongsViewModel
    @State private var playlistView:Bool = false
    @State private var alertMessage: String?
    @State private var showAlert:Bool = false
    static let shared = SharedViewModel()
    let token = SessionManager.shared.token
   
    func fetchPlaylists() {
       let baseURL = "http://localhost:4000/api/playlists/getUserPlaylists"
       let token = SessionManager.shared.token

       guard let url = URL(string: baseURL) else { return }

       var request = URLRequest(url: url)
       request.httpMethod = "GET"
       request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

       URLSession.shared.dataTask(with: request) { data, response, error in
           DispatchQueue.main.async {
               self.isLoading = false

               if let error = error {
                   print("Network error: \(error.localizedDescription)")
                   self.errorMessage = error.localizedDescription
                   return
               }

               guard let data = data else {
                   print("No data received")
                   self.errorMessage = "No data received"
                   return
               }

               do {
                   let response = try JSONDecoder().decode(PlaylistResponse.self, from: data)
                   if response.success {
                       self.playlists = response.userToPlaylists.playlists
                      // print(response.userToPlaylists.playlists)
                       print(self.playlists)
                   } else {
                       self.errorMessage = response.message
                   }
               } catch {
                   print("Decoding error: \(error)")
                   self.errorMessage = "Failed to decode response"
               }
           }
       }.resume()
   }
    
    func addTrackToPlaylist(trackId: String, playlistId: String) {
       
        guard let url = URL(string: "http://localhost:4000/api/playlists/addTrackToPlaylist") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        let body: [String: Any] = [
            "playlistID": playlistId,
            "trackID": trackId
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            print("Error: Unable to encode body parameters \(error)")
            return
        }
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                DispatchQueue.main.async {
                    // self?.alertMessage = "Network error: \(error.localizedDescription)"
                    // self?.showAlert = true
                }
                return
            }
            
            guard let data = data,
                  let httpResponse = response as? HTTPURLResponse else {
                DispatchQueue.main.async {
                    //self?.alertMessage = "Invalid response from server."
                    // self?.showAlert = true
                }
                return
            }
            
            if httpResponse.statusCode == 201 {
                do {
                    let response = try JSONDecoder().decode(PlaylistAddingResponse.self, from: data)
                    DispatchQueue.main.async {
                        print(response)
                        if response.success {
                            
                            // Handle successful addition here
                             self.alertMessage = response.message
                        } else {
                            self.alertMessage = response.message
                        }
                         self.showAlert = true
                    }
                } catch {
                    DispatchQueue.main.async {
                        self.alertMessage = "Failed to decode response."
                        self.showAlert = true
                    }
                }
            } else {
                DispatchQueue.main.async {
                    self.alertMessage = "Failed to add track to playlist."
                    self.showAlert = true
                }
            }
            
            self.fetchPlaylists()
            
        }.resume()
    }
    
}


struct Playlist: Codable {
    let _id: String
    let name: String
    let owner: String
    let tracks: [String]
    let __v: Int
}

struct PlaylistResponse: Codable {
    let message: String
    let success: Bool
    let username: String
    let userToPlaylists: UserToPlaylists
}

struct UserToPlaylists: Codable {
    let _id: String
    let username: String
    let playlists: [Playlist]
    let __v: Int
}

#Preview {
  PlaylistGrid()
    .environmentObject(SharedViewModel.shared)
}
