//
//  LikedAlbumsView.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 8.12.2023.
//

import SwiftUI

struct LikedAlbumsView: View {
  @EnvironmentObject var viewModel: LikedSongsViewModel

    var body: some View {
      ForEach(viewModel.likedAlbums, id: \._id){ album in
        let artists = album.artists.map { $0.name }.joined(separator: ", ")
        let albumImageURL = album.imageURL
        HStack{
          LImage_RText(contentID: album._id, contentType: "ALBUM", songName: album.name, artistNames: artists, imageURL: albumImageURL)
          Spacer()
        }
      }
    }
}

#Preview {
  LikedAlbumsView().preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}
