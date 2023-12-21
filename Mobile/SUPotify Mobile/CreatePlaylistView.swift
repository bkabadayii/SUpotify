import SwiftUI

struct CreatePlaylistView: View {
    
    @State private var name: String = ""
    @State private var playlistDescription: String = ""
    @State private var isRotated:Bool = false
    @State private var searchSongs:Bool = false
    @State private var isPlaylistCreated:Bool = false
   
    
    var body: some View {
        NavigationStack{
            ZStack {
                BackgroundView()
                
                VStack(alignment: .center) {
                    Spacer()
                    
                    TextField("Playlist Name", text: $name)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                        .padding()
                        .frame(width: 350)
                        .background(Color.indigo.opacity(0.50))
                        .cornerRadius(10)
                        .foregroundColor(.white)
                    
                    
                    Spacer()
                    
                    Circle()
                        .strokeBorder(AngularGradient(gradient: Gradient(
                            colors: [.indigo, .blue, .purple, .orange, .red]),
                                                      center: .center,
                                                      angle: .zero),
                                      lineWidth: 15)
                        .rotationEffect(isRotated ? .zero : .degrees(360))
                        .frame(maxWidth: 70, maxHeight: 70)
                        .onAppear {
                            withAnimation(Animation.spring(duration: 3)) {
                                isRotated.toggle() //toggle the value
                            }
                            withAnimation(Animation.linear(duration: 7).repeatForever(autoreverses: false)) {
                                isRotated.toggle()
                            }
                        }
                    
                    Spacer()
                    
                    Button(action: {
                        isPlaylistCreated = true
                        playlistCreate(playlistName: name)
                    }) {
                        Text("Create Playlist")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(width: 300, height: 50)
                            .background(Color.indigo.opacity(0.85))
                            .cornerRadius(15)
                    }
                    .padding()
                    
                    
                    NavigationLink(destination: Profile(), isActive: $isPlaylistCreated){
                        EmptyView()
                        
                        Spacer()
                    }
                    .padding(.top, 50)
                }
            }.navigationTitle("Create Playlist")
        }
    }
    
    private func playlistCreate(playlistName: String) {
            let apiURL = URL(string: "http://localhost:4000/api/playlists/createPlaylist")!
            var request = URLRequest(url: apiURL)
            let token = SessionManager.shared.token // Replace with your token retrieval method

            request.httpMethod = "POST"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

            let parameters: [String: Any] = ["playlistName": playlistName]

            do {
                request.httpBody = try JSONSerialization.data(withJSONObject: parameters)
            } catch {
                print("Error encoding parameters: \(error)")
                return
            }

            URLSession.shared.dataTask(with: request) { data, response, error in
                DispatchQueue.main.async {
                    if let error = error {
                        print("Error making network request: \(error)")
                        return
                    }
                    
                    if let response = try? JSONDecoder().decode(PlaylistCreationResponse.self, from: data!) {
                                if response.success {
                                    isPlaylistCreated = true
                                } else {
                                    print("Playlist creation failed with message: \(response.message)")
                                }
                            } else {
                                print("Failed to decode response")
                                let responseString = String(data: data!, encoding: .utf8) ?? "Unable to decode data"
                                print("Response: \(responseString)")
                            }
                }
            }.resume()
        }



    struct PlaylistCreationResponse: Codable {
        let message: String
        let success: Bool
        let playlistName: String?
        let username: String?
    }
    
    
}

