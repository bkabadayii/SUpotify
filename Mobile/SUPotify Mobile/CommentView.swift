//
//  CommentView.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 24.12.2023.
//

import SwiftUI

struct CommentView: View {

  @State var isRotated: Bool = false
  var songName: String
  var artistName: String

  var body: some View {

      ZStack{

        //Layer 0
        BackgroundView()

        // Layer 1
        Circle()
          .strokeBorder(AngularGradient(gradient: Gradient(
            colors: [.indigo, .blue, .purple, .orange, .red]),
                                        center: .center,
                                        angle: .zero),
                        lineWidth: 15)
          .rotationEffect(isRotated ? .zero : .degrees(360))
          .frame(maxWidth: 70, maxHeight: 70)
          .onAppear {
            withAnimation(Animation.spring(duration: 3)) {
              isRotated.toggle()
            }
            withAnimation(Animation.linear(duration: 7).repeatForever(autoreverses: false)) {
              isRotated.toggle()
            }
          }





      
      .navigationTitle("Comments of \(songName) by \(artistName)")
      .navigationBarTitleDisplayMode(.inline)
    }
  }
}



#Preview {
  CommentView(songName: "Track", artistName: "artist").preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}
