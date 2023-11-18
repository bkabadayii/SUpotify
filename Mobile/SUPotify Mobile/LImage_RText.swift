//
//  LImage_RText.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 16.11.2023.
//

import SwiftUI

struct LImage_RText: View {
    
    @State private var showActionSheet = false
    
    var songName: String
    var artistNames: String
    var imageURL: String
    
    var body: some View {
        HStack {

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
            /*
            Image(systemName: "timelapse")
                .resizable()
                .frame(width:20, height:20)
                .padding(.leading, 5)
            Spacer()
             */
            Image(systemName: "ellipsis")
               // .resizable()
               // .frame(width:30, height:30)
                .padding(.trailing, 10)
                .onTapGesture {
                    self.showActionSheet = true
                }
            
        }
        .padding(15)
        .background(Color.black)
        .foregroundColor(.white)
        .actionSheet(isPresented: $showActionSheet) {
            ActionSheet(
                title: Text("Options"),
                buttons: [
                    .default(Text("Share")) {
                        // Implement share action
                    },
                    .destructive(Text("Delete")) {
                        // Implement delete action
                    },
                    .cancel()
                ]
            )
        }
    }
}

#Preview {
    LImage_RText(songName: "track", artistNames: "artists", imageURL: "https://i.scdn.co/image/ab6761610000e5eb59ba2466b22929f5e7ca21e4")
}
