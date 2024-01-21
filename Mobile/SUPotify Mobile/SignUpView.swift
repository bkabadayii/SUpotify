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

  func createLikedContent(token: String) {
    guard let url = URL(string: "http://localhost:4000/api/likedContent/createLikedContent") else {
      print("Invalid URL")
      return
    }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

    URLSession.shared.dataTask(with: request) { data, response, error in
      if let error = error {
        print("Error: \(error.localizedDescription)")
        return
      }
      if let httpResponse = response as? HTTPURLResponse {
        print("HTTP Response Status code: \(httpResponse.statusCode)")
      }
      // Handle the response or data here as necessary
    }.resume()
  }

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

                  let parameters2: [String: Any] = ["email": email, "password": password]

                  guard let url2 = URL(string: "http://localhost:4000/auth/login") else {
                    print("Invalid URL")
                    return
                  }

                  var request2 = URLRequest(url: url2)
                  request2.httpMethod = "POST"
                  request2.setValue("application/json", forHTTPHeaderField: "Content-Type")
                  request2.addValue("application/json", forHTTPHeaderField: "Accept")

                  do {
                    request2.httpBody = try JSONSerialization.data(withJSONObject: parameters2)
                  } catch {
                    print("Error encoding parameters: \(error)")
                    return
                  }

                  URLSession.shared.dataTask(with: request2) { data2, response2, error in
                    if let data2 = data2 {
                      do {
                        // print("Response JSON: \(String(data: data, encoding: .utf8) ?? "No data")") for debug purposes

                        let result2 = try JSONDecoder().decode(LoginResponse.self, from: data2)
                        //SessionManager.shared.loginResponse = result2
                        //SessionManager.shared.token = result2.token


                        if let success2 = result2.success, success2{
                          if let userDetails2 = result2.userDetails {

                            if(result2.token != "") {

                              //self.isLoggedin = true
                              print("Login successful")
                              print("User email: \(userDetails2.email)")
                              print("User username: \(userDetails2.username)")
                              print("Token: \(result2.token)")

                              createLikedContent(token: result2.token)

                              //SessionManager.shared.username = userDetails.username
                            }
                          }
                          else {
                            print("Login successful but user details are missing")
                          }
                        } else {
                          print(result2.message)
                        }
                      } catch {
                        print("Error decoding JSON: \(error)")
                      }
                    } else if let error = error {
                      print("Error making network request: \(error)")
                    }
                  }.resume()


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
      BackgroundView3()
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
          .foregroundColor(.white)


        TextField("Email", text: $email)
          .padding()
          .frame(width: 300, height: 50)
          .background(Color.black.opacity(0.50))
          .autocapitalization(.none)
          .cornerRadius(10)
          
        TextField("Username", text: $username)
          .padding()
          .frame(width: 300, height: 50)
          .background(Color.black.opacity(0.50))
          .autocapitalization(.none)
          .cornerRadius(10)

        SecureField("Password", text: $password)
          .padding()
          .frame(width: 300, height: 50)
          .background(Color.black.opacity(0.50))
          .autocapitalization(.none)
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
