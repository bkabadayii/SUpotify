import SwiftUI

struct PlaylistGrid: View {
    // Sample data for playlists
    let playlists = [
        Playlist(name: "2023 Summer", numberOfSongs: 20, imageName: "playlist1"),
        Playlist(name: "Workout Mix", numberOfSongs: 15, imageName: "playlist2"),
        Playlist(name: "Coffee Time", numberOfSongs: 35, imageName: "playlist1"),
        Playlist(name: "Study with Me", numberOfSongs: 86, imageName: "playlist2"),
        Playlist(name: "Deep House", numberOfSongs: 140, imageName: "playlist2"),
        Playlist(name: "Road Trip", numberOfSongs: 90, imageName: "playlist2"),
        // Add more playlists as needed
    ]

    // Define the layout for the grid
    let layout = [
        GridItem(.flexible()),
        GridItem(.flexible())
    ]
    
    @State private var createPlaylist = false

    var body: some View {
            VStack(alignment: .leading) {
                HStack {
                    Button(action: {
                        createPlaylist = true
                    }) {
                        Label("Create a playlist", systemImage: "plus.circle.fill")
                            .foregroundColor(.indigo)
                            .labelStyle(.titleAndIcon)
                    }
                    
                    Spacer() // Pushes the button to the left
                }
                .padding()

                NavigationLink(destination: CreatePlaylistView(), isActive: $createPlaylist) {
                    EmptyView()
                }
               

                ScrollView {
                    LazyVGrid(columns: layout, spacing: 20) {
                        ForEach(playlists, id: \.name) { playlist in
                            VStack {
                                            // Replace with actual image loading logic
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

                                Text("\(playlist.numberOfSongs) Songs")
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
        }
}

// Model for a Playlist
struct Playlist: Identifiable {
    let id = UUID()
    var name: String
    var numberOfSongs: Int
    var imageName: String
}

struct PlaylistGrid_Previews: PreviewProvider {
    static var previews: some View {
        PlaylistGrid()
            .preferredColorScheme(.dark)
    }
}
