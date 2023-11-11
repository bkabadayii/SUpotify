//
//  LikedSongsPage.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 8.11.2023.
//

import SwiftUI

struct LikedSongsPage: View {
    var body: some View {
        NavigationView {
            List {
                ForEach(0..<10) { songIndex in
                    Text("Liked Song \(songIndex + 1)")
                }
            }
            .navigationTitle("Liked Songs")
        }
    }
}

struct LikedSongs_Previews: PreviewProvider {
    static var previews: some View {
        LikedSongsPage()
            .preferredColorScheme(.dark)
    }
}

struct LikedSongsData: Codable {
    let username: String
    let likedSongsList: [String]
}

struct LikedSongsResponse: Codable {
    let message: String
    let success: Bool?
    let userLikedSongs: LikedSongsData?
}

