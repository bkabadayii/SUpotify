
//  ForYouPage.swift
//  SUPotify Mobile App
//
//  Created by Deniz Özdemir on 11/9/23.
//

import SwiftUI

struct RecommendationResponse: Codable {
    let message: String
    let recommendations: [likedTracks]
    let success: Bool
}

struct likedTracks: Codable{
    let track: Track
  //  let likedAt: Date
   // let _id: String
}


struct Track: Codable{
  //  let _id: String
    let name: String
    let spotifyID: String
   // let album: Album
   // let artists: [Artist]
   /* let popularity: Int
    let durationMS: Int
    let artists: [Artist]
    let spotifyURL: String
    let previewURL: String*/
}


struct Artist: Codable{
    //let _id: String
    let name: String
   /* let genres: [String]
    let popularity: Int
    let albums: [Album]
    let spotifyID: String
    let spotifyURL: String
    let imageURL: String*/
}

struct getTrackResponse: Codable {
    let message: String
    let success: Bool
    let track: Tracks
}


struct ForYouView: View {
    @State private var recommendedTracks: [Track] = []
      @State private var isLoading = false
      @State private var currentIdx: Int = 0
      @GestureState private var dragOffset: CGFloat = 0

      var body: some View {
          NavigationStack {
              VStack {
                  if isLoading {
                      ProgressView()
                  } else {
                      ZStack {
                          ForEach(recommendedTracks.indices, id: \.self) { index in
                              Group {
                                  if index == currentIdx {
                                      TrackCardView(track: recommendedTracks[index])
                                          .offset(x: dragOffset)
                                          .transition(.slide)
                                          .animation(.easeInOut, value: dragOffset)
                                  }
                              }
                          }
                      }
                      .gesture(
                          DragGesture()
                              .updating($dragOffset, body: { value, state, _ in
                                  state = value.translation.width
                              })
                              .onEnded({ value in
                                  let threshold: CGFloat = 50
                                  if value.translation.width > threshold {
                                      currentIdx = max(0, currentIdx - 1)
                                  } else if value.translation.width < -threshold {
                                      currentIdx = min(recommendedTracks.count - 1, currentIdx + 1)
                                  }
                              })
                      )
                      ButtonsView()
                  }
              }
              .onAppear {
                  fetchRecommendations()
              }
          }
       }
    
    func fetchRecommendations() {
        let trackNum = 2
        let token = SessionManager.shared.token
           let url = URL(string: "http://localhost:4000/api/recommendation/recommendTrackFromFollowedUser/\(trackNum)")!

           var request = URLRequest(url: url)
           request.httpMethod = "GET"
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

          
          URLSession.shared.dataTask(with: request) { data, response, error in
               DispatchQueue.main.async {
                  
                   guard let data = data, error == nil else {
                       print(error?.localizedDescription ?? "Unknown Error")
                       return
                   }

                   do {
                       let response = try JSONDecoder().decode(RecommendationResponse.self, from: data)
                       print(response)
                       self.recommendedTracks = response.recommendations.map { $0.track }
                       print(response.recommendations)
                       
                       let spotifyIDs = response.recommendations.map { $0.track.spotifyID }
                        print("Spotify IDs of Recommended Tracks: \(spotifyIDs)")
                       
                       for spotifyID in spotifyIDs {
                           fetchSpotifyTrackInfo(spotifyID: spotifyID)
                       }
                       
                   } catch {
                       print("Decoding Error: \(error.localizedDescription)")
                   }
               }
           }.resume()
       }
    
    func fetchSpotifyTrackInfo(spotifyID: String) {
        let token = SessionManager.shared.token
        let url = URL(string: "http://localhost:4000/api/content/getTrack/\(spotifyID)")!

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                guard let data = data, error == nil else {
                    print(error?.localizedDescription ?? "Unknown Error")
                    return
                }
                
                print(String(data: data, encoding: .utf8) ?? "No data")
                do {
                    let trackInfo = try JSONDecoder().decode(getTrackResponse.self, from: data)
                    print(trackInfo)
                    // Process the received data as needed
                } catch {
                    print("Decoding Error: \(error.localizedDescription)")
                }
            }
        }.resume()
    }
}




#Preview {
    ForYouView()
        .preferredColorScheme(.dark)
}

struct ButtonsView: View {
    
    var body: some View {
        
        
        HStack (spacing: 12){
            Button(action: {
                ShowSongInfo()
            }, label: {
                VStack (spacing: 8){
                    Image(systemName: "music.note.list")
                        .font(.title)
                        .foregroundColor(.indigo)
                    
                }
            })
            
            
            Button(action: {
                AddToLikedSongs()
            }, label: {
                VStack (spacing: 10){
                    Image(systemName: "heart.fill")
                        .font(.title)
                        .foregroundColor(.indigo)
                    
                    
                }
            })
            
            Button(action: {
                AddToPlaylist()
            }, label: {
                VStack (spacing: 8){
                    Image(systemName: "plus.circle.fill")
                        .font(.title)
                        .foregroundColor(.indigo)
                    
                    
                }
            })
            
            Button(action: {
                Share()
            }, label: {
                VStack (spacing: 8){
                    Image(systemName: "square.and.arrow.up.fill")
                        .font(.title)
                        .foregroundColor(.indigo)
                    
                    
                }
            })
        }
        .frame(width: 300, height: 60)
        .background(.black.opacity(0.10))
        .cornerRadius(100)
        
        
        
    }
}

class Host: UIHostingController<ContentView> {
    override var preferredStatusBarStyle: UIStatusBarStyle{
        return .lightContent
    }
}

struct TrackCardView: View {
    let track: Track

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
           /* if let imageUrl = track.image, let url = URL(string: imageUrl) {
                AsyncImage(url: url) { image in
                    image.resizable()
                } placeholder: {
                    Color.gray
                }
                .frame(width: 300, height: 200)
                .cornerRadius(10)
            }*/
            Image(systemName: "music.note")
                .frame(width: 300, height: 200)
                .cornerRadius(10)

            Text(track.name)
                .font(.title)
                .bold()

           /* Text("Artists: \(track.artists.map { $0._id }.joined(separator: ", "))")
                            .font(.subheadline)*/

            /*Text("Album: \(track.album.name)")
                .font(.subheadline)*/
        }
        .frame(width: 300)
        .padding()
        .background(Color.gray.opacity(0.2))
        .cornerRadius(20)
    }
}




func ShowSongInfo(){
    
}

func AddToLikedSongs(){
    
}

func AddToPlaylist(){
    
}

func Share(){
    
}




