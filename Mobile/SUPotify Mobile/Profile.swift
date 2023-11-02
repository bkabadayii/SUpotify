//
//  Profile.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 2.11.2023.
//

import SwiftUI

struct Profile: View {
    var body: some View {
        ScrollView {
            HStack {
                VStack(alignment: .leading, spacing: 9) {
                    Text("Name")
                        .font(.title)
                    
                    Text("@username")
                        .font(.subheadline)
                }
                .padding(.horizontal, 16)
                
                Spacer()
                
                Image(systemName: "person.circle.fill")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 100, height: 100)
                    .foregroundColor(.blue)
            }
            .padding(.top, 16)
            .padding(.horizontal, 16)
            
            Divider()
                .padding(.horizontal, 16)
                .padding(.bottom, 16)
            
            HStack {
                Spacer()
                Text("Posts")
                    .font(.headline)
                Spacer()
                Text("Followers")
                    .font(.headline)
                Spacer()
                Text("Following")
                    .font(.headline)
                Spacer()
            }
            .padding(.horizontal, 16)
            
            Divider()
                .padding(.horizontal, 16)
            
            // Add a grid of user's posts here
            // You can use a LazyVGrid or ForEach to display user's posts
            
            Spacer()
        }
        .navigationBarTitle("Profile", displayMode: .inline)
    }
}

struct Profile_Previews: PreviewProvider {
    static var previews: some View {
        NavigationView {
            Profile()
        }
    }
}

