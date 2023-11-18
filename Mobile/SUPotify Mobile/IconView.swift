//
//  IconView.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 18.11.2023.
//

import SwiftUI

struct IconView: View {
    @State var isRotated = false
    
    var body: some View {
        
        
        ZStack {
            BackgroundView()
            Circle()
                .strokeBorder(AngularGradient(gradient: Gradient(
                    colors: [.indigo, .blue, .purple, .orange, .red]),
                                              center: .center,
                                              angle: .zero),
                              lineWidth: 15)
                .rotationEffect(isRotated ? .zero : .degrees( 160))
                .frame(maxWidth: 70, maxHeight: 70)
            /*
             .onAppear {
             withAnimation(Animation.spring(duration: 3)) {
             isRotated.toggle() //toggle the value
             }
             withAnimation(Animation.linear(duration: 7).repeatForever(autoreverses: false)) {
             isRotated.toggle()
             }
             }*/
        }
        
        
    }
}

#Preview {
    IconView().preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}
