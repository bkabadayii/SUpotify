//
//  SongDetailsView.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 7.12.2023.
//

import SwiftUI
import Foundation

struct RatingInfoResponse: Codable {
  var message: String
  var success: Bool
  var selfRating: Int?
  var averageRating: Int?
  var numUsersRated: Int?
}

struct RateContentRequest: Codable {
  var ratingType: String
  var relatedID: String
  var rating: Int
}

struct UpdateRatingRequest: Codable {
  var ratingType: String
  var relatedID: String
  var rating: Int
}


class RatingService {
  static let shared = RatingService()
  private let baseUrl = "http://localhost:4000/api/ratings"
  private var userToken = SessionManager.shared.token

  func getRatingInfo(ratingType: String, relatedID: String, completion: @escaping (RatingInfoResponse?) -> Void) {
    let url = URL(string: "\(baseUrl)/getRatingInfo/\(ratingType)/\(relatedID)")!
    var request = URLRequest(url: url)
    request.httpMethod = "GET"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
    
    URLSession.shared.dataTask(with: request) { data, response, error in
      DispatchQueue.main.async {
        guard let data = data, error == nil else {
          completion(nil)
          return
        }
        
        let response = try? JSONDecoder().decode(RatingInfoResponse.self, from: data)
        completion(response)
      }
    }.resume()
  }
  
  func createUserToRatings(completion: @escaping () -> Void) {
    let url = URL(string: "\(baseUrl)/createUserToRatings")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
    
    URLSession.shared.dataTask(with: request) { _, _, _ in
      completion()
    }.resume()
  }
  
  func rateContent(ratingType: String, relatedID: String, rating: Int) {
    let url = URL(string: "\(baseUrl)/rateContent")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")
    
    let body = RateContentRequest(ratingType: ratingType, relatedID: relatedID, rating: rating)
    request.httpBody = try? JSONEncoder().encode(body)
    
    URLSession.shared.dataTask(with: request).resume()
  }


  func getLyrics(songName: String, artistName: String, completion: @escaping (String?) -> Void) {
      let formattedSongName = songName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
      let firstArtistName = artistName.components(separatedBy: ", ").first ?? ""
      let formattedArtistName = firstArtistName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
      let urlString = "http://localhost:4000/api/getFromGenius/getLyricsOfASong/\(formattedSongName)/\(formattedArtistName)"
      guard let url = URL(string: urlString) else {
          completion(nil)
          return
      }

      var request = URLRequest(url: url)
      request.httpMethod = "GET"
      request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")

      URLSession.shared.dataTask(with: request) { data, response, error in
          DispatchQueue.main.async {

            if let error = error {
                            print("Error fetching lyrics: \(error)")
                            completion(nil)
                            return
                        }
            guard let data = data else {
                            print("No data received")
                            completion(nil)
                            return
                        }

            // Print the raw JSON string for debugging
                        if let jsonStr = String(data: data, encoding: .utf8) {
                            print("Raw JSON response: \(jsonStr)")
                          print(artistName)
                        }

              do {
                  let jsonObject = try JSONSerialization.jsonObject(with: data, options: [])
                  if let jsonDict = jsonObject as? [String: Any], let lyrics = jsonDict["lyrics"] as? String {
                      completion(lyrics)
                  } else {
                      completion(nil)
                  }
              } catch {
                print("JSON parsing error: \(error)")
                                completion(nil)
              }
          }
      }.resume()
  }

}

struct RatingView: View {
    @Binding var rating: Int
    var maximumRating = 10
    var onRatingChanged: (Int) -> Void

    var offColor = Color.gray
    var onColor = Color.blue

    var body: some View {
        HStack {
            ForEach(1...maximumRating, id: \.self) { number in
                Image(systemName: "circle.fill")
                    .foregroundColor(number <= rating ? onColor : offColor)
                    .onTapGesture {
                        rating = number
                        onRatingChanged(number)
                    }
            }
        }
    }
}



struct SongDetailsView: View {
  var songID: String
  var songName: String
  var artistNames: String
  var imageURL: String
  var ratingType: String

  @State private var songRating: Int = 0
  @State private var initialRating: Int?
  @State private var hasRating: Bool = false
  @State private var isSliderInUse: Bool = false
  @State private var lyrics: String? = nil

  @State var isRotated: Bool = false

  var body: some View {
    ZStack {
      // Layer 0
      BackgroundView()
      
      // Layer 1
      ScrollView {
        VStack {
          //Spacer()

          ImageView(urlString: imageURL)
            .aspectRatio(contentMode: .fill)
            .frame(maxWidth: 300, maxHeight: 300, alignment: .center)
            .shadow(radius: 20)
            .clipped()
          
          HStack {
            VStack(alignment: .leading) {
              Text(songName)
                .font(.title.bold())
                .foregroundStyle(.white)
              Text(artistNames)
                .foregroundStyle(.white)
            }
            
            Spacer()
            
            NavigationLink(destination: CommentView(contentID: songID, contentType: ratingType, songName: songName, artistName: artistNames)) {
              Image(systemName: "text.bubble")
                .font(.title)
                .foregroundStyle(.blue)
            }

          }
          .padding()
          HStack {
            Text("Rating:")
              .font(.system(size: 14, weight: .medium))
              .foregroundStyle(.white)


            RatingView(rating: $songRating) { newRating in
                updateRating(ratingType: ratingType, newRating: newRating)
            }
            .padding()


          }

          if let lyrics = lyrics {
              // Displaying the lyrics
              Text(lyrics)
                  .foregroundColor(.white)
                  .padding()
          } else {
              // Optionally, show a loading indicator or a "Lyrics not available" message
            ZStack{
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
            }.frame(width: 100, height: 100, alignment: .center)

          }

          Spacer()
        }
        .padding()
      }
    }
    .onAppear {
      fetchLyrics()
      if initialRating == nil {
        getInitialRatingInfo()
      }
    }
  }

  func fetchLyrics() {
      RatingService.shared.getLyrics(songName: songName, artistName: artistNames) { fetchedLyrics in
          self.lyrics = fetchedLyrics?.replacingOccurrences(of: "\\n", with: "\n")
        print("Fetched lyrics: \(self.lyrics ?? "None")")
      }
  }

  private func updateRating(ratingType: String, newRating: Int) {
      print("New rating is \(newRating)")
      if newRating != initialRating {
          if hasRating {
              RatingService.shared.rateContent(ratingType: ratingType, relatedID: songID, rating: newRating)
          } else {
              RatingService.shared.createUserToRatings {
                  RatingService.shared.rateContent(ratingType: ratingType, relatedID: songID, rating: newRating)
              }
          }
          initialRating = newRating // Update the initial rating after sending it
          print("Rating sent: \(newRating)")
      }
  }


  private func getInitialRatingInfo() {
    RatingService.shared.getRatingInfo(ratingType: ratingType, relatedID: songID) { response in
      if let response = response {
        if response.success {
          DispatchQueue.main.async {
            self.songRating = response.selfRating ?? 0
            self.initialRating = self.songRating
            self.hasRating = true
          }
        } else {
          DispatchQueue.main.async {
            self.songRating = 0
            self.initialRating = nil
            self.hasRating = false
          }
        }
      }
    }
  }
  
  private func sliderEditingChanged(editing: Bool) {
    isSliderInUse = editing
    if !editing {
      // The user finished interacting with the slider
      if songRating != initialRating {
        if hasRating {
          // Since update rating is not working now, we use rateContent for the example
          RatingService.shared.rateContent(ratingType: ratingType, relatedID: songID, rating: songRating)
        } else {
          RatingService.shared.createUserToRatings {
            // If the rating did not exist before, we need to create it first
            RatingService.shared.rateContent(ratingType: ratingType, relatedID: songID, rating: songRating)
          }
        }
        initialRating = songRating // Update the initial rating after sending it
        print("Rating sent: \(songRating)")
      }
    }
  }
}


#Preview {
  SongDetailsView(songID: "", songName: "DAMLA", artistNames: "Motive", imageURL: "https://i.scdn.co/image/ab6761610000e5eb59ba2466b22929f5e7ca21e4", ratingType: "TRACK").preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}
