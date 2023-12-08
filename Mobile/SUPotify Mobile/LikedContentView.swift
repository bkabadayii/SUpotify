//
//  LikedContentView.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 17.11.2023.
//

import SwiftUI
import Foundation
import Combine

struct TrackData: Codable {
  let _id: String
  let name: String
  let popularity: Int
  let durationMS: Int
  let album: AlbumData
  let artists: [ArtistData]
  let spotifyID: String
  let spotifyURL: String
  let previewURL: String?
  let __v: Int
}

struct AlbumData: Codable {
  let _id: String
  let name: String
  let imageURL: String
}

struct ArtistData: Codable {
  let _id: String
  let name: String
}

struct LikedContent: Codable {
  let track: TrackData
  let likedAt: String
  let _id: String
}

struct LikedSongsResponse: Codable {
  let message: String
  let success: Bool
  let likedContent: [LikedContent]
}

struct RemoveResponseStruct: Codable {
  var message: String
}


class LikedSongsViewModel: ObservableObject {
  static let shared = LikedSongsViewModel()
  @Published var likedSongs = [TrackData]()
  private var token: String
  private var cancellables = Set<AnyCancellable>()
  @Published var likedSongsCount: Int = 0

  init() {
    self.token = SessionManager.shared.token
    fetchLikedSongs()
  }

  func fetchLikedSongs() {
    let contentType = "TRACK"
    guard let url = URL(string: "http://localhost:4000/api/likedContent/getLikedContent/\(contentType)") else { return }

    var request = URLRequest(url: url)
    request.httpMethod = "GET"
    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

    URLSession.shared.dataTaskPublisher(for: request)
      .tryMap { $0.data }
      .decode(type: LikedSongsResponse.self, decoder: JSONDecoder())
      .receive(on: DispatchQueue.main)
      .sink(receiveCompletion: { completion in
        switch completion {
        case .finished:
          print("Retrieved data successfully.")
        case .failure(let error):
          print("Error occurred: \(error)")
        }
      }, receiveValue: { [weak self] response in
        self?.likedSongs = response.likedContent.map { $0.track }
        self?.likedSongsCount = response.likedContent.count
      })
      .store(in: &cancellables)
  }


  func removeFromUserLikedSongs(songID: String, userToken: String, completion: @escaping (Result<RemoveResponseStruct, Error>) -> Void) {
    guard let url = URL(string: "http://localhost:4000/api/likedContent/removeFromLikedContent") else {
      completion(.failure(NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])))
      return
    }

    var request = URLRequest(url: url)
    request.httpMethod = "DELETE"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
    request.addValue("application/json", forHTTPHeaderField: "Content-Type")

    let requestBody = ["contentID": songID, "contentType": "TRACK"]
    request.httpBody = try? JSONSerialization.data(withJSONObject: requestBody)

    let task = URLSession.shared.dataTask(with: request) { data, response, error in
      if let error = error {
        completion(.failure(error))
        return
      }
      guard let data = data else {
        completion(.failure(NSError(domain: "", code: 0, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
        return
      }

      do {
        let decodedResponse = try JSONDecoder().decode(RemoveResponseStruct.self, from: data)
        completion(.success(decodedResponse))
      } catch {
        completion(.failure(error))
      }
    }

    task.resume()
  }

  func refreshLikedSongs() {
    DispatchQueue.main.async {
      self.fetchLikedSongs()
    }
  }
}

struct LikedContentView: View {
  @State var searchBox_offset:CGFloat = 30

  //@State private var searchText = ""
  @State private var isSearchEmpty = false

  @State private var showExportOptions = false
  @State private var showImportView = false
  @EnvironmentObject var viewModel: LikedSongsViewModel

  @State private var tabSelect = 0

  var body: some View {
    ZStack{

      // Layer 0
      LinearGradient(gradient: Gradient(colors:
                                          [Color.blue,
                                           Color.indigo,Color.blue, Color.indigo, Color.blue, Color.black,Color.black, Color.black, Color.black, Color.black]),
                     startPoint: .topLeading, endPoint: .bottomTrailing)
      .opacity(0.6)
      .edgesIgnoringSafeArea(.all)


      // Layer 1
      ScrollView{
        GeometryReader{geo -> AnyView? in
          let thisOffset = geo.frame(in: .global).minY
          DispatchQueue.main.async {
            if thisOffset > 38 {
              self.searchBox_offset = thisOffset
            }
            else{
              self.searchBox_offset = 38
            }
          }
          return nil
        }
        VStack (spacing:0) {
          HStack{
            Spacer()
              .frame(height: 80)
              .background(LinearGradient(gradient:
                                          Gradient(colors:
                                                    [Color.clear,
                                                     Color.clear,
                                                     //Color.clear,
                                                     //Color.clear,
                                                     //Color.clear,
                                                     Color.clear,
                                                     Color.black]),
                                         startPoint: .top, endPoint: .bottom))
          }
          VStack{
            if tabSelect == 0 {

              LikedSongsView()

            } else if tabSelect == 1{
              LikedAlbumsView()
            }
            else{
              LikedArtistsView()
            }

          }.background(Color.black)
        }
      }

      // Layer 2
      VStack (spacing:0) {
        LinearGradient(colors:
                        [Color.blue, Color.clear],
                       startPoint: .top, endPoint: .bottom)
        .opacity(0.4)
        .ignoresSafeArea()
        .frame(height:80)
        Spacer()
      }.edgesIgnoringSafeArea(.all)


      // Layer 3
      VStack {
        Spacer()
          .frame(height:searchBox_offset + 5)

        HStack{

          Picker("Options", selection: $tabSelect) {
            Text("Liked Songs").tag(0)
            Text("Liked Albums").tag(1)
            Text("Liked Artists").tag(2)
          }
          .pickerStyle(SegmentedPickerStyle())
          .background(Color.black)
          .clipShape(RoundedRectangle(cornerRadius: 8))
          .padding()

          }
          Spacer()
        }


        // Layer 4
        VStack{
          HStack{
            Button(action: {
              self.showImportView = true
            }) {
              Image(systemName: "arrow.down.doc")
                .foregroundColor(.white)
            }
            .padding()
            Spacer()
            Text("Your Library")
              .font(.system(size: 24, weight:.bold))
            Spacer()
            Button(action: {
              self.showExportOptions = true
            }) {
              Image(systemName: "square.and.arrow.up")
                .foregroundColor(.white)
            }.padding()

          }
          Spacer()
        }
        /* For UI adjustments
         VStack{
         Text("\(searchBox_offset)")
         .foregroundColor(.yellow)
         Spacer()
         }
         */


        .sheet(isPresented: $showExportOptions, onDismiss: {
          //navigationViewKey = UUID()
          showExportOptions = false
        }) {
          ExportOptionsView()
        }


        .sheet(isPresented: $showImportView, onDismiss: {
          //navigationViewKey = UUID()
          showImportView = false
        }) {
          ImportView()
        }

      }
    }

    func commaSeparatedString(from array: [String]) -> String {
      array.joined(separator: ", ")
    }
  }

#Preview {
  LikedContentView()
    .environmentObject(LikedSongsViewModel.shared).preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)

}
