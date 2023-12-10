//
//  SUPotifyMobileApp.swift
//  SUPotify Mobile
//
//  Created by Deniz Özdemir on 10/19/23.
//

import SwiftUI

@main
struct SUPotifyMobileApp: App {
    @StateObject var likedSongsViewModel = LikedSongsViewModel.shared
    var body: some Scene {
        WindowGroup {
            ContentView()
                .preferredColorScheme(.dark)
                .environmentObject(likedSongsViewModel)
                
        }
    }
}
