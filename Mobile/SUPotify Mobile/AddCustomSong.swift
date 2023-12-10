//
//  AddCustomSong.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 10.12.2023.
//

import SwiftUI

struct RateContentRequestBody: Encodable {
  var trackName: String
  var albumName: String
  var artists: [String]
}

struct AddCustomSong: View {
  @State private var trackName: String = ""
  @State private var albumName: String = ""
  @State private var artists: [String] = ["", "", "", "", ""]
  @State private var showingAlert = false
  @State private var alertMessage = ""
  private let userToken = SessionManager.shared.token

  var body: some View {


    NavigationView {
      ZStack {
        BackgroundView()
        Form {
          Section(header: Text("Track Information")) {
            TextField("Track Name", text: $trackName)
            TextField("Album Name", text: $albumName)

            ForEach(0..<5, id: \.self) { index in
              TextField("Artist \(index + 1)", text: $artists[index])
            }
          }

          Button("Submit") {
            submitCustomSong()
          }
        }
        .navigationBarTitle("Add Custom Song")
        .alert(isPresented: $showingAlert) {
          Alert(title: Text("Message"), message: Text(alertMessage), dismissButton: .default(Text("OK")))
        }
      }


    }
  }

  private func submitCustomSong() {
    guard !trackName.isEmpty, !albumName.isEmpty else {
      alertMessage = "Please enter both track and album names."
      showingAlert = true
      return
    }

    let filteredArtists = artists.filter { !$0.isEmpty }
    let requestBody = RateContentRequestBody(trackName: trackName, albumName: albumName, artists: filteredArtists)

    guard let url = URL(string: "http://localhost:4000/api/likedContent/likeCustomTrack") else {
      alertMessage = "Invalid URL."
      showingAlert = true
      return
    }

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")
    request.httpBody = try? JSONEncoder().encode(requestBody)

    URLSession.shared.dataTask(with: request) { data, response, error in
      DispatchQueue.main.async {
        if let error = error {
          alertMessage = "Error: \(error.localizedDescription)"
          showingAlert = true
        } else {
          alertMessage = "Track submitted successfully."
          showingAlert = true
        }
      }
    }.resume()
  }

}


#Preview {
  AddCustomSong()
}
