//
//  SignUpView.swift
//  SUPotify Mobile App
//
//  Created by Deniz Özdemir on 10/31/23.
//

import SwiftUI

struct SignUpView: View {
    
    @State private var username = ""
    @State private var password = ""
    @State private var email = ""
    @State var isRotated: Bool = false

    
    var body: some View {
        
            NavigationStack{
                
                ZStack(alignment: /*@START_MENU_TOKEN@*/.center/*@END_MENU_TOKEN@*/, content: {
                    BackgroundVieww()
                    VStack{
                        Circle()
                            .strokeBorder(AngularGradient(gradient: Gradient(
                                colors: [.indigo, .blue, .purple, .orange, .red]),
                                                          center: .center,
                                                          angle: .zero),
                                          lineWidth: 15)
                            .rotationEffect(isRotated ? .zero : .degrees(360))
                            .frame(maxWidth: 70, maxHeight: 70)
                            .onAppear {
                                withAnimation(Animation.spring()) {
                                    isRotated.toggle() //toggle the value
                                }}
                        
                        Text("Create Account")
                            .font(.title)
                            .bold()
                            .padding(30)
                            .foregroundColor(.black)
                        
                        
                        TextField("Email", text: $email)
                            .padding()
                            .frame(width: 300, height: 50)
                            .background(Color.black.opacity(0.50))
                            .cornerRadius(10)
                        TextField("Username", text: $username)
                            .padding()
                            .frame(width: 300, height: 50)
                            .background(Color.black.opacity(0.50))
                            .cornerRadius(10)
                        
                        SecureField("Password", text: $password)
                            .padding()
                            .frame(width: 300, height: 50)
                            .background(Color.black.opacity(0.50))
                            .cornerRadius(10)
                        
                        Button(action: {
                            print("Button clicked")
                        }, label: {
                            NavigationLink(destination: MainMenu()) {
                                Text("Sign up")
                            }
                        })
                        .padding()
                        .foregroundColor(.white)
                        .frame(width: 100.0, height: 50)
                        .background(.black.opacity(0.50))
                        .cornerRadius(10)
                        
                    }
                    
                })
            }
        }
        
    }


#Preview {
    SignUpView()
        .preferredColorScheme(.dark)
}


struct BackgroundVieww: View {
    var body: some View {
        LinearGradient(colors: [.blue, .indigo, .blue, .indigo, .blue], startPoint: .topLeading, endPoint: .bottomTrailing)
            .opacity(0.6)
            .ignoresSafeArea()
       
        /*Circle()
            .scale(1.7)
            .foregroundColor(.white.opacity(0.15))
        Circle()
            .scale(1.35)
            .foregroundColor(.white.opacity(0.70))*/
    }
}
