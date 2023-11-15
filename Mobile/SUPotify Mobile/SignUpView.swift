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
    @State private var isSigningUp = false
    @State private var isSignUpSuccessful = false
    @State private var errorMessage: String?
    
    @State var isRotated: Bool = false

    // Function to send the sign-up request
    func signup() -> Bool {
        let parameters = ["username": username, "email": email, "password": password]
        
        if let jsonData = try? JSONSerialization.data(withJSONObject: parameters) {
            if let url = URL(string: "http://localhost:4000/auth/signup") {
                var request = URLRequest(url: url)
                request.httpMethod = "POST"
                request.httpBody = jsonData
                request.addValue("application/json", forHTTPHeaderField: "Content-Type")
                
                isSigningUp = true
                URLSession.shared.dataTask(with: request) { data, response, error in
                    isSigningUp = false
                    if let data = data {
                        if let responseString = String(data: data, encoding: .utf8) {
                            if responseString.contains("User already exists") {
                                DispatchQueue.main.async {
                                    errorMessage = "User already exists"
                                }
                            } else {
                                DispatchQueue.main.async {
                                    errorMessage = nil
                                    isSignUpSuccessful = true
                                    // Handle successful signup
                                }
                            }
                        }
                    }
                }.resume()
            }
        }
        return isSignUpSuccessful
    }

    
    var body: some View {
        
                
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
                                withAnimation(Animation.spring(duration: 3)) {
                                    isRotated.toggle() //toggle the value
                                }
                                withAnimation(Animation.linear(duration: 7).repeatForever(autoreverses: false)) {
                                    isRotated.toggle()
                                }
                            }

                        
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
                        
                        if let errorMessage = errorMessage {
                            Text(errorMessage)
                                .foregroundColor(.red)
                                .padding()
                        }
                        
                        Button(action: {
                            // Perform the HTTP POST request here
                            self.email = self.email.lowercased()
                            self.username = self.username.lowercased()
                            if self.signup(){
                                isSignUpSuccessful = true
                            }
                        }, label: {
                            Text("Sign up")
                        })
                        .padding()
                        .foregroundColor(.white)
                        .frame(width: 100.0, height: 50)
                        .background(.black.opacity(0.50))
                        .cornerRadius(10)
                        
                        NavigationLink("", destination: LoginView(), isActive: $isSignUpSuccessful)
                                            .opacity(0)
                                            .frame(width: 0)
                                            .disabled(true)

                    }
                    
                })
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
    }
}
