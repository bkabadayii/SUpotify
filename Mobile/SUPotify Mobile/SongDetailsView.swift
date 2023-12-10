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
  var rating: Double
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
  /*
   func updateRating(ratingType: String, relatedID: String, rating: Double) {
   let url = URL(string: "\(baseUrl)/updateRating")!
   var request = URLRequest(url: url)
   request.httpMethod = "POST"
   request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
   request.addValue("application/json", forHTTPHeaderField: "Content-Type")
   
   let body = UpdateRatingRequest(ratingType: ratingType, relatedID: relatedID, rating: rating)
   request.httpBody = try? JSONEncoder().encode(body)
   
   URLSession.shared.dataTask(with: request).resume()
   }
   
   */
}


struct SongDetailsView: View {
  var songID: String
  var songName: String
  var artistNames: String
  var imageURL: String
  var ratingType: String

  @State private var songRating: Double = 0
  @State private var initialRating: Double?
  @State private var hasRating: Bool = false
  @State private var isSliderInUse: Bool = false
  
  var body: some View {
    ZStack {
      // Layer 0
      BackgroundView()
      
      // Layer 1
      VStack {
        Spacer()
        
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
          
          Button {
            print("Favorited")
          } label: {
            Image(systemName: "heart.fill")
              .font(.title)
              .foregroundStyle(.green)
          }
        }
        .padding()
        HStack {
          Text("My Rating:")
            .font(.system(size: 14, weight: .medium))
            .foregroundStyle(.white)
          
          Slider(value: $songRating, in: 0...10, step: 0.1, onEditingChanged: sliderEditingChanged)
            .tint(.white)
          /*
           .onChange(of: songRating) { newValue in
           let roundedRating = Double(round(100 * newValue) / 100)
           print("Slider changing to: \(roundedRating)")
           }*/
            .padding()
        }
        
        Spacer()
      }
      .padding()
    }
    .onAppear {
      if initialRating == nil {
        getInitialRatingInfo()
      }
    }
  }
  
  private func getInitialRatingInfo() {
    RatingService.shared.getRatingInfo(ratingType: ratingType, relatedID: songID) { response in
      if let response = response {
        if response.success {
          DispatchQueue.main.async {
            self.songRating = response.selfRating.map(Double.init) ?? 0
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
      let roundedRating = Double(round(100 * songRating) / 100) // Limiting to two decimals
      if songRating != initialRating {
        if hasRating {
          // Since update rating is not working now, we use rateContent for the example
          RatingService.shared.rateContent(ratingType: ratingType, relatedID: songID, rating: Int(roundedRating))
        } else {
          RatingService.shared.createUserToRatings {
            // If the rating did not exist before, we need to create it first
            RatingService.shared.rateContent(ratingType: ratingType, relatedID: songID, rating: Int(roundedRating))
          }
        }
        initialRating = roundedRating // Update the initial rating after sending it
        print("Rating sent: \(roundedRating)")
      }
    }
  }
  
  private func updateRatingIfNeeded(ratingType: String) {
    let roundedRating = Double(round(100 * songRating) / 100) // Limiting to two decimals
    if !isSliderInUse && songRating != initialRating {
      print("Final rating to send: \(roundedRating)")
      /*
       if hasRating {
       RatingService.shared.rateContent(ratingType: "TRACK", relatedID: songID, rating: roundedRating)
       } else {
       RatingService.shared.rateContent(ratingType: "TRACK", relatedID: songID, rating: Int(roundedRating))
       }
       */
      
      RatingService.shared.rateContent(ratingType: ratingType, relatedID: songID, rating: Int(roundedRating))
      initialRating = roundedRating // Update the initial rating after sending it
    }
  }
}


#Preview {
  SongDetailsView(songID: "", songName: "DAMLA", artistNames: "Motive", imageURL: "https://i.scdn.co/image/ab6761610000e5eb59ba2466b22929f5e7ca21e4", ratingType: "TRACK").preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}
