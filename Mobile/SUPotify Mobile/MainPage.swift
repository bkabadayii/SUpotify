//
//  MainPage.swift
//  SUPotify Mobile
//
//  Created by Alkım Özyüzer on 28.10.2023.
//

import SwiftUI

struct MainMenu: View {
    var body: some View {
        TabView {
            // Tab 1
            Text("Home page")
                .tabItem {
                    Image(systemName: "house.fill")
                }
            
            // Tab 2
            Text("Tab 2")
                .tabItem {
                    Image(systemName: "2.circle")
                    Text("Tab 2")
                }
            
            // Tab 2
            Text("Tab 3")
                .tabItem {
                    Image(systemName: "3.circle")
                    Text("Tab 3")
                }
            
            // Tab 2
            Text("Tab 4")
                .tabItem {
                    Image(systemName: "4.circle")
                    Text("Tab 4")
                }
            
            // Tab 2
            // Profile Tab
                NavigationView {
                    Profile()
                }
                .tabItem {
                    Image(systemName: "person.crop.circle.fill")
                    Text("Profile")
                }
        }
        .font(.title)

    }
}

struct MainMenu_Previews: PreviewProvider {
    static var previews: some View {
        MainMenu()
            .preferredColorScheme(.dark)
    }
}

