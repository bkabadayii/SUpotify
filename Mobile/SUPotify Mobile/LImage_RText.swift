//
//  LImage_RText.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 16.11.2023.
//

import SwiftUI
import Foundation

struct LImage_RText: View {
    @EnvironmentObject var viewModel: LikedSongsViewModel
    @State private var showActionSheet = false
    var contentID: String
    var contentType: String
    var songName: String
    var artistNames: String
    var imageURL: String
    var isPlaylist: Bool
    @State private var showingPlaylistPicker = false
    @State var playlists: [Playlist] = []
    @State private var selectedPlaylistId: String = ""
    @EnvironmentObject var viewModel2: SharedViewModel
    
    
    var body: some View {
        
        VStack {
            HStack {
                NavigationLink(destination: SongDetailsView(songID: contentID, songName: songName, artistNames: artistNames, imageURL: imageURL, ratingType: contentType)) {
                    ImageView(urlString: imageURL)
                        .aspectRatio(contentMode: .fill)
                        .frame(width:55, height:55)
                        .clipped()
                        .border(Color.gray, width: 1)
                        .padding(.leading, 10)
                    Text("\(songName)")
                        .padding(.leading, 15)
                        .font(.system(size: 14, weight: .bold))
                    Spacer()
                    Text("\(artistNames)")
                        .padding(.trailing, 15)
                        .font(.system(size: 12, weight: .medium))
                }
                /*
                 Image(systemName: "timelapse")
                 .resizable()
                 .frame(width:20, height:20)
                 .padding(.leading, 5)
                 Spacer()
                 */
                if(isPlaylist){
                    
                }
                else{
                    Image(systemName: "ellipsis")
                    // .resizable()
                    // .frame(width:30, height:30)
                        .padding(.trailing, 10)
                        .onTapGesture {
                            self.showActionSheet = true
                        }
                }
                
            }
            .padding(15)
            .background(Color.black)
            .foregroundColor(.white)
            
            Divider()
                .background(Color.white)
                .padding([.leading, .trailing], 10)
            
                .actionSheet(isPresented: $showActionSheet) {
                    ActionSheet(
                        title: Text("Options"),
                        buttons: [
                            .default(Text("Add to playlist")) {
                                viewModel2.fetchPlaylists()
                                self.showingPlaylistPicker = true
                                self.selectedPlaylistId = ""
                            },
                            .destructive(Text("Delete")) {
                                viewModel.removeFromUserLikedSongs(contentID: contentID, contentType: contentType, userToken: SessionManager.shared.token){result in
                                    switch result {
                                    case .success(let response):
                                        print("Success: \(response)")
                                        DispatchQueue.main.async {
                                            viewModel.refreshLibrary()
                                        }
                                    case .failure(let error):
                                        print("Error: \(error.localizedDescription)")
                                    }
                                }
                                
                            },
                            
                                .cancel()
                        ]
                    )
                }
        } .sheet(isPresented: $showingPlaylistPicker) {
            
            PlaylistPickerView(playlists: $viewModel2.playlists, selectedPlaylistId: $selectedPlaylistId, trackId: contentID, viewModel2: viewModel2)
        }
        
    }
    
    
    struct PlaylistPickerView: View {
        @Binding var playlists: [Playlist]
        @Binding var selectedPlaylistId: String
        let trackId: String
        @State var isRotated = false
        @ObservedObject var viewModel2: SharedViewModel
        let layout = [GridItem(.flexible()), GridItem(.flexible())]
    
        
        var body: some View {
            ZStack{
                VStack{
                    HStack{
                        Circle()
                            .strokeBorder(AngularGradient(gradient: Gradient(
                                colors: [.indigo, .blue, .purple, .orange, .red]),
                                                          center: .center,
                                                          angle: .zero),
                                          lineWidth: 15)
                            .rotationEffect(isRotated ? .zero : .degrees( 360))
                            .frame(maxWidth: 50, maxHeight: 50)
                            .onAppear {
                                withAnimation(Animation.spring(duration: 3)) {
                                    isRotated.toggle()
                                }
                                withAnimation(Animation.linear(duration: 7).repeatForever(autoreverses: false)) {
                                    isRotated.toggle()
                                }
                            }
                            .padding()
                        
                        Text("Your playlists")
                            .font(.title)
                            .foregroundColor(.indigo)
                            .bold()
                            .padding()
                        
                    }
                    
                   List(playlists, id: \._id) { playlist in
                        HStack {
                            Text(playlist.name)
                            
                            Spacer()
                            
                            if selectedPlaylistId == playlist._id {
                                Image(systemName: "checkmark")
                                    .foregroundColor(.indigo)
                                    .font(.headline)
                            }
                        }
                        .onTapGesture {
                            self.selectedPlaylistId = playlist._id
                        }
                     
                    }
                
                    
                    Button("Add to Selected Playlist") {
                        viewModel2.addTrackToPlaylist(trackId: trackId, playlistId: selectedPlaylistId)
                    }
                    .disabled(selectedPlaylistId.isEmpty)
                    
                }.navigationTitle("Select Playlist")
            }.onAppear(perform: viewModel2.fetchPlaylists)
        }
    }
}

#Preview {
  LImage_RText(contentID: "", contentType: "TRACK", songName: "track", artistNames: "artists", imageURL: "", isPlaylist: true).environmentObject(SharedViewModel.shared)
}
