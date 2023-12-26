//
//  LikedSongsView.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 8.12.2023.
//

import SwiftUI

struct LikedSongsView: View {
  
  @EnvironmentObject var viewModel: LikedSongsViewModel

    var body: some View {
      ForEach(viewModel.likedSongs, id: \._id){ song in
        let artists = song.artists.map { $0.name }.joined(separator: ", ")
        let albumImageURL = song.album.imageURL
        HStack{
          LImage_RText(contentID: song._id, contentType: "TRACK", songName: song.name, artistNames: artists, imageURL: albumImageURL, isPlaylist: false).environmentObject(SharedViewModel.shared)
          Spacer()
        }

        /*
         // For preview
         ForEach(0..<30){ i in
         HStack{
         LImage_RText(songName: "track", artistNames: "artists", imageURL: "https://i.scdn.co/image/ab6761610000e5eb59ba2466b22929f5e7ca21e4")
         Spacer()
         }
         }
         */
      }
    }
}

#Preview {
  LikedSongsView()
    .environmentObject(LikedSongsViewModel.shared).preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)

}
