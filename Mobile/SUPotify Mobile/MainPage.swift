//
//  MainPage.swift
//  SUPotify Mobile
//
//  Created by Alkım Özyüzer on 28.10.2023.
//

import SwiftUI

struct MainMenu: View {
    @StateObject var likedSongsViewModel = LikedSongsViewModel()
    
    var body: some View {
        TabView {
            
          NavigationView{
            HomeView()
          }
            .tabItem {
                Image(systemName: "house.fill")
                Text("Home")
            }

            SearchView()
            .environmentObject(likedSongsViewModel)
            .tabItem {
                Image(systemName: "magnifyingglass")
                Text("Search")
            }

            ForYouView()
            .tabItem {
                Image(systemName: "heart.fill")
                Text("For You")
            }

            LikedContentView()
            .environmentObject(likedSongsViewModel)
            .tabItem {
                Image(systemName: "hand.thumbsup.fill")
                Text("Library")
            }
            
            Profile()
            .tabItem {
                Image(systemName: "person.crop.circle.fill")
                Text("Profile")
            }
        }
        .font(.title)
        .navigationBarBackButtonHidden(true)

    }
}

struct MainMenu_Previews: PreviewProvider {
    static var previews: some View {
        MainMenu()
            .preferredColorScheme(.dark)
    }
}

