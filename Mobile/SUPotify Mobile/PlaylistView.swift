//
//  PlaylistView.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 16.11.2023.
//

import SwiftUI

struct PlaylistView: View {
    @StateObject private var viewModel = PlaylistViewModel()
    let playlistID: String
    @Environment(\.presentationMode) var presentationMode
    @State private var showActionSheet = false
    @State private var selectedTrackId: String = ""
    
    var topSpacer_height:CGFloat = 380
    
    var body: some View {
        ZStack{
            LinearGradient(gradient: Gradient(colors:
                                                [Color.init(red:55/255,
                                                            green: 50/255, blue: 200/255),
                                                 Color.black,Color.black]),
                           startPoint: .top, endPoint: .bottom).edgesIgnoringSafeArea(.all)
            
            // Layer 1
            Spacer()
            VStack {
                Spacer()
                    .frame(height:50)

                if let playlist = viewModel.playlist {
                    if viewModel.tracks?.count ?? 0 >= 4 {
                        // Display composite image of the first four tracks
                        let coverImages = viewModel.coverImageURLs(for: playlist)
                        // Here you would create your composite image view
                        CompositeImageView(imageURLs: coverImages)
                        .aspectRatio(contentMode: .fill)
                        .frame(width:200, height:200)

                        .clipped()

                        .padding()
                    } else if let firstTrackCover = viewModel.tracks?.first?.album.imageURL {
                        // Display the cover image of the first track
                        ImageView(urlString: firstTrackCover)
                            //.resizable()
                            .aspectRatio(contentMode: .fill)
                            .frame(width:200, height:200)

                            .clipped()
                      
                            .padding()
                    }
                }

                   
                
                if let playlist = viewModel.playlist {
                    Text(playlist.name)
                        .foregroundColor(Color.white)
                        .font(.system(size: 24, weight: .bold))
                        .padding()
                        
                }
                
                Spacer()
            }
            
            
            // Layer 2
            ScrollView {
                VStack(spacing:0) {
                    HStack{
                        Spacer()
                            .frame(height:topSpacer_height)
                            .background(LinearGradient(gradient:
                                                        Gradient(colors:
                                                                    [Color.clear,
                                                                     Color.clear,
                                                                     Color.clear,
                                                                     Color.clear,
                                                                     Color.clear,
                                                                     Color.clear,
                                                                     Color.black]),
                                                       startPoint: .top, endPoint: .bottom))
                        Spacer()
                    }
                    
                    VStack {
                        ForEach(viewModel.tracks ?? []) { track in
                            HStack {
                                LImage_RText(contentID: track.id, contentType: "TRACK", songName: track.name, artistNames: track.artists.map { $0.name }.joined(separator: ", "), imageURL: track.album.imageURL, isPlaylist: true).environmentObject(SharedViewModel.shared)
                                
                                Spacer()
                                
                                Image(systemName: "ellipsis")
                                    .padding(.trailing, 10)
                                    .onTapGesture {
                                        self.showActionSheet = true
                                        self.selectedTrackId = track.id
                                    }
                            }
                        }
                    }.background(Color.black)
                        .actionSheet(isPresented: $showActionSheet) {
                            ActionSheet(
                                title: Text("Options"),
                                buttons: [
                                    .destructive(Text("Delete")) {
                                        
                                        viewModel.removeTrackFromPlaylist(playlistID: playlistID, trackID: selectedTrackId) 
                                     
                                    },
                                    .cancel()
                                ]

                            )}
                }
                
            }
            .onAppear {
                viewModel.getPlaylist(playlistID: playlistID)
            }
        }.navigationBarBackButtonHidden(false)
        
    }
}


class PlaylistViewModel: ObservableObject {
    @Published var playlist: Playlistt? = nil
    @Published var tracks: [Playlistt.Track]? = nil
    @Published var isLoading = false
    @Published var errorMessage: String? = nil
    let token = SessionManager.shared.token
    
    
    func getPlaylist(playlistID: String) {
        isLoading = true
        let urlString = "http://localhost:4000/api/playlists/getPlaylist/\(playlistID)"
        guard let url = URL(string: urlString) else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            DispatchQueue.main.async {
                self?.isLoading = false
                if let data = data {
                    do {
                        let decodedResponse = try JSONDecoder().decode(getPlaylistResponse.self, from: data)
                        self?.playlist = decodedResponse.playlist
                        self?.tracks = decodedResponse.playlist.tracks
                        print(decodedResponse)
                    } catch {
                        self?.errorMessage = "Failed to decode playlist"
                        print("Decoding Error: \(error)")
                    }
                } else if let error = error {
                    self?.errorMessage = error.localizedDescription
                    print("Network Error: \(error.localizedDescription)")
                }
            }
        }.resume()
    }

    func coverImageURLs(for playlist: Playlistt) -> [String] {
        let trackImageURLs = playlist.tracks.prefix(4).compactMap { $0.album.imageURL }
        return trackImageURLs
    }

    
    func removeTrackFromPlaylist(playlistID: String, trackID: String) {
        guard let url = URL(string: "http://localhost:4000/api/playlists/removeTrackFromPlaylist") else { return }
        
        let token = SessionManager.shared.token
        
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: String] = [
            "playlistID": playlistID,
            "trackID": trackID
        ]
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            print("Error: Unable to encode body parameters \(error)")
            return
        }
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Network error: \(error.localizedDescription)")
                return
            }
            
            guard let data = data, let httpResponse = response as? HTTPURLResponse else {
                print("Invalid response from server.")
                return
            }
            
            if httpResponse.statusCode == 201 {
                do {
                    let response = try JSONDecoder().decode(RemoveTrackResponse.self, from: data)
                    DispatchQueue.main.async {
                        // Handle the updated playlist here
                        print("Removed track from playlist: \(response.updatedPlaylist)")
                    }
                } catch {
                    print("Decoding error: \(error)")
                }
            } else {
                print("Failed to remove track from playlist. Status code: \(httpResponse.statusCode)")
            }
            self.getPlaylist(playlistID: playlistID)
        }.resume()
    }
    
    struct RemoveTrackResponse: Codable {
        let message: String
        let success: Bool
        let updatedPlaylist: Playlistt
    }
    
}

struct getPlaylistResponse: Codable {
    let message: String
    let success: Bool
    let playlist: Playlistt
}


struct Playlistt: Codable{
    let _id: String
    let name: String
    let tracks: [Track]
    
    struct Track: Codable, Identifiable {
        let _id: String
        let name: String
        let artists: [Artist]
        let album: Album
        
        var id: String { _id }
        
        struct Artist: Codable {
            let name: String
        }
        struct Album: Codable {
            let imageURL: String
        }
    }
}

struct CompositeImageView: View {
    var imageURLs: [String]

    var body: some View {
        GeometryReader { geometry in
            VStack(spacing: 0) {
                ForEach(0..<2) { row in
                    HStack(spacing: 0) {
                        ForEach(0..<2) { column in
                            let index = row * 2 + column
                            if index < imageURLs.count {
                                ImageView(urlString: imageURLs[index])
                                    //.resizable() // Ensure the image can be resized
                                    .scaledToFill() // Fill the frame maintaining aspect ratio
                                    .frame(width: geometry.size.width / 2, height: geometry.size.height / 2)
                                    .clipped() // Clip the overflowing parts
                            }
                        }
                    }
                }
            }
            .frame(width: geometry.size.width, height: geometry.size.height) // Set the frame for VStack
        }
    }
}


#Preview {
  PlaylistView(playlistID: "")
    .preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
    .environmentObject(SharedViewModel.shared)

}
