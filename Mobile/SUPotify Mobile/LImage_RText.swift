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
              .default(Text("Share")) {
                // Implement share action
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
    }
  }
}

#Preview {
  LImage_RText(contentID: "", contentType: "TRACK", songName: "track", artistNames: "artists", imageURL: "", isPlaylist: true)
}
