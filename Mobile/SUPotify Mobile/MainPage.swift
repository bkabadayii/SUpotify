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
            Text("Tab 1")
                .tabItem {
                    Image(systemName: "1.circle")
                    Text("Tab 1")
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
            Text("Tab 5")
                .tabItem {
                    Image(systemName: "5.circle")
                    Text("Tab 5")
                }
        }
    }
}

struct MainMenu_Previews: PreviewProvider {
    static var previews: some View {
        MainMenu()
    }
}

