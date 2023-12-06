import SwiftUI

struct PlaylistGrid: View {
    @State private var playlists = [Playlist]()
    @State private var isLoading = false
    @State private var errorMessage: String?
    @State private var createPlaylist = false
    @State private var isRotated:Bool = false

    let layout = [GridItem(.flexible()), GridItem(.flexible())]

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
                    ForEach(playlists, id: \.id) { playlist in
                        VStack {
                            if isLoading {
                                
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
                            }
                            
                            Image(systemName: "music.note.list")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 100, height: 100)
                                .padding()
                                .background(Color.gray.opacity(0.3))
                                .cornerRadius(10)

                            Text(playlist.name)
                                .font(.headline)
                                .foregroundColor(.indigo)

                            Text("\(playlist.tracks.count) Songs")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
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
                        // Access the playlists from the userToPlaylists object
                        self.playlists = response.userToPlaylists.playlists
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




}

struct PlaylistGrid_Previews: PreviewProvider {
    static var previews: some View {
        PlaylistGrid()
            .preferredColorScheme(.dark)
    }
}

struct Playlist: Identifiable, Codable {
    var id: String
    var name: String
    var owner: String
    var tracks: [Track]
    var __v: Int
    
    enum CodingKeys: String, CodingKey {
          case id = "_id"  // Map the "_id" JSON field to the "id" property
          case name, owner, tracks, __v
      }
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
