
//  ForYouPage.swift
//  SUPotify Mobile App
//
//  Created by Deniz Özdemir on 11/9/23.
//

import SwiftUI

<<<<<<< Updated upstream
struct ForYouView: View {
    
    @State private var currentIdx: Int = 0
    @GestureState private var dragOffset: CGFloat = 0
    
    
    var body: some View {
        NavigationStack {
            VStack{
                ZStack{
                    BackgroundView()
                    
                    ForEach(0..<data.count, id: \.self) { index in
                        
                        VStack{
                            
                            Text("")
                            Text("")
                            Text("")
                            
                            Image(data[index].photo)
                                .frame(width: 300, height: 450)
                                .cornerRadius(35)
                                .opacity(currentIdx == index ? 1.0 : 0.5)
                                .scaleEffect(currentIdx == index ? 1.2 : 0.8)
                                .offset(x: CGFloat(index - currentIdx) * 300 + dragOffset, y:0)
                            
                            Text("")
                            Text("")
                            Text("")
                            Text("")
                            
                            VStack{
                                Text(data[index].sname)
                                    .font(.largeTitle)
                                    .bold()
                                    .foregroundColor(.white.opacity(10))
                                    .opacity(currentIdx == index ? 1.0 : 0.5)
                                    .scaleEffect(currentIdx == index ? 1.2 : 0.8)
                                    .offset(x: CGFloat(index - currentIdx) * 300 + dragOffset, y:0)
                                Text(data[index].artist)
                                    .font(.subheadline)
                                    .foregroundColor(.white)
                                    .opacity(currentIdx == index ? 1.0 : 0.5)
                                    .scaleEffect(currentIdx == index ? 1.2 : 0.8)
                                    .offset(x: CGFloat(index - currentIdx) * 300 + dragOffset, y:0)
                            }
                            .frame(width: 290, height: 80)
                            .background(.black.opacity(0.10))
                            .cornerRadius(100)
                            
                            
                            Text("")
                            
                            
                            ButtonsView()
                            
                            
                            
                        }
                    }
                    
=======
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
   let album: String
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

struct Album: Codable {
  let name : String
  //let _id: String
  let imageURL: String
   // let spotifyURL: String
}


struct getTrackResponse: Codable {
    let message: String
    let success: Bool
    let album: Album
}


struct ForYouView: View {
    @State var recommendedTracks: [Track] = []
      @State private var isLoading = false
      @State private var currentIdx: Int = 0
      @GestureState private var dragOffset: CGFloat = 0

    @State private var albumDataForTracks: [String: Album] = [:]

     
      var body: some View {
          NavigationStack {
              VStack {
                  if isLoading {
                      ProgressView()
                  } else {
                      ZStack {
                          ForEach(recommendedTracks.indices, id: \.self) { index in
                              Group {
                                  let track = recommendedTracks[index]
                                let album = albumDataForTracks[track.spotifyID]
                                  if index == currentIdx {
                                      TrackCardView(track: track, album: album ?? nil)
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
                       
                       let albumIDs = response.recommendations.map { $0.track.album }
                        print("Album IDs of Recommended Tracks: \(albumIDs)")
                       
                       for albumID in albumIDs {
                           fetchSpotifyTrackInfo(albumID: albumID)
                       }
                       
                      /* for track in self.recommendedTracks {
                           fetchSpotifyTrackInfo(albumID: track.album)
                       }*/
                       
                   } catch {
                       print("Decoding Error: \(error.localizedDescription)")
                   }
               }
           }.resume()
       }
    
    func fetchSpotifyTrackInfo(albumID: String) {
        let token = SessionManager.shared.token
        let url = URL(string: "http://localhost:4000/api/content/getAlbum/\(albumID)")!

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                guard let data = data, error == nil else {
                    print(error?.localizedDescription ?? "Unknown Error")
                    return
>>>>>>> Stashed changes
                }
                .gesture(DragGesture()
                    .onEnded({value in
                        let threshold: CGFloat = 50
                        if value.translation.width > threshold {
                            withAnimation{
                                currentIdx = max(0, currentIdx - 1)
                            }
                        }
                        else if value.translation.width < -threshold {
                            withAnimation {
                                currentIdx = min(data.count - 1, currentIdx + 1)
                                
                            }
                        }
                        
                    })
                         
                         
                )
                
                
<<<<<<< Updated upstream
=======
                print(String(data: data, encoding: .utf8) ?? "No data")
                do {
                    let response = try JSONDecoder().decode(getTrackResponse.self, from: data)
                    self.albumDataForTracks[albumID] = response.album
                    print(albumDataForTracks[albumID])
                   // print(trackInfo)
                    // Process the received data as needed
                } catch {
                    print("Decoding Error: \(error.localizedDescription)")
                }
>>>>>>> Stashed changes
            }
            
        }
        
        
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

<<<<<<< Updated upstream

struct Song: Identifiable {
    var id: Int
    var artist: String
    var sname: String
    var photo: String
}

var data = [
    
    Song(id: 0, artist: "The Weeknd", sname: "Die For You", photo: "weeknd"),
    
    Song(id: 1, artist: "Britney Spears", sname: "Toxic", photo: "britney"),
    
    Song(id: 2, artist: "Fred Again", sname: "Rumble", photo: "fred"),
    
    Song(id: 3, artist: "Travis Scott", sname: "Fair Trade", photo: "travis"),
    
    Song(id: 4, artist: "Inji", sname: "Belly Dancing", photo: "inji"),
    
]
=======
struct TrackCardView: View {
    let track: Track
    let album: Album?

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            if let albumImageURL = album?.imageURL, let url = URL(string: albumImageURL) {
                AsyncImage(url: url) { image in
                    image.resizable()
                } placeholder: {
                    Color.gray
                }
                .frame(width: 300, height: 200)
                .cornerRadius(10)
            }
            //AlbumView(albumInfo: album)
            

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

/*
struct AlbumView: View {
    @State var albumInfo: Album

    var body: some View {
        VStack {
            if let url = URL(string: albumInfo.imageURL) {
                AsyncImage(url: url) { image in
                    image.resizable()
                } placeholder: {
                    Color.gray
                }
                .aspectRatio(contentMode: .fill)
                .frame(width: 300, height: 200)
                .cornerRadius(10)
            }
            else {
                Image(systemName: "photo")
                    .frame(width: 200, height: 200)
                    .cornerRadius(10)
                    .foregroundColor(.gray)
            }

            Text(albumInfo.name)
                .font(.title2)
                .bold()
        }
    }
}
*/


>>>>>>> Stashed changes

func ShowSongInfo(){
    
}

func AddToLikedSongs(){
    
}
func AddToPlaylist(){
    
}
func Share(){
    
}


