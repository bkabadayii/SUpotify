//
//  AddCustomSong.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 10.12.2023.
//

import SwiftUI
import Foundation

struct RateContentRequestBody: Encodable {
  var trackName: String
  var albumName: String
  var artists: [String]
}

struct AddCustomSong: View {
  @EnvironmentObject var viewModel: LikedSongsViewModel
  @Environment(\.presentationMode) var presentationMode

  @State private var trackName: String = ""
  @State private var albumName: String = ""
  @State private var artists: [String] = ["", "", "", "", ""]
  @State private var showingAlert = false
  @State private var alertMessage = ""
  @State private var navigateToLikedContent = false
  private let userToken = SessionManager.shared.token

  var body: some View {

    NavigationView {

      VStack {

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
            DispatchQueue.main.async {
                viewModel.refreshLibrary()
            }
          }
        }
        .background(.opacity(1))
        NavigationLink(destination: LikedContentView().environmentObject(LikedSongsViewModel.shared
                                                                        ), isActive: $navigateToLikedContent) {
              EmptyView()
          }
        }
      .navigationBarTitle("Add Custom Song")
      .alert(isPresented: $showingAlert) {
        Alert(title: Text("Message"), message: Text(alertMessage), dismissButton: .default(Text("OK"), action:{

          if alertMessage == "Track submitted successfully." {
            self.presentationMode.wrappedValue.dismiss()
                              }
        }))
      }
    }
  }

  func submitCustomSong() {
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

          self.viewModel.refreshLibrary()
        }
      }
    }.resume()
  }

}


#Preview {
  AddCustomSong()
    .environmentObject(LikedSongsViewModel.shared).preferredColorScheme(.dark)
}
