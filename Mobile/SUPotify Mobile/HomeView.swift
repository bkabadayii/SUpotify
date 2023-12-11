//
//  HomeView.swift
//  SUPotify Mobile App
//
//  Created by Deniz Özdemir on 12/6/23.
//

import SwiftUI
import Charts

struct TopRatedTracksRequest: Codable {
    struct Filters: Codable {
        var rateDate: [String]
        var releaseDate: [String]
        var genres: [String]
        var artists: [String]
    }
    var filters: Filters
    //var numItems: Int
}


struct TopRatedTracksResponse: Codable {
    struct TrackRating: Codable {
        struct Track: Codable {
            struct Album: Codable {
                var _id: String
                var name: String
                var releaseDate: String
                var imageURL: String
            }
            struct Artist: Codable {
                var _id: String
                var name: String
                var genres: [String]
                var popularity: Int
                var spotifyURL: String
                var imageURL: String
            }
            var _id: String
            var name: String
            var popularity: Int
            var durationMS: Int
            var album: Album
            var artists: [Artist]
            var spotifyID: String
            var spotifyURL: String
            var previewURL: String
        }
        var track: Track
        var rating: Int
        var ratedAt: String
        var _id: String
    }
    var message: String
    var success: Bool
    var trackRatings: [TrackRating]
    // Additional fields for genre and artist ratings can be added here if needed.
}


class HomeViewModel: ObservableObject {
    @Published var topRatedTracksResponse: TopRatedTracksResponse?

    func fetchTopRatedTracks(userToken: String, requestBody: TopRatedTracksRequest) {
        guard let url = URL(string: "http://localhost:4000/api/statistics/getTopRatedTracks") else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        do {
            request.httpBody = try JSONEncoder().encode(requestBody)
        } catch {
            print("Error encoding request body: \(error)")
            return
        }

        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    print("Error: \(error)")
                    return
                }
                guard let data = data else {
                    print("No data received")
                    return
                }
                do {
                    let decodedResponse = try JSONDecoder().decode(TopRatedTracksResponse.self, from: data)
                    self?.topRatedTracksResponse = decodedResponse
                } catch {
                    print("Error decoding response: \(error)")
                }
            }
        }.resume()
    }
}


struct HomeView: View {
  @StateObject var viewModel = HomeViewModel() // ViewModel instance
    @State private var selectedTab: StatisticCategory = .albums
    @State private var startDate: Date = Calendar.current.date(byAdding: .year, value: -1, to: Date()) ?? Date()
    @State private var endDate: Date = Date()
    @State private var genre: String = "" // Provide a default value
    @State private var selectedOption: String = "Ranking based"
    let username = SessionManager.shared.username
  let userToken = SessionManager.shared.token
    let options = ["Ranking based", "Liked Songs based"]

    var body: some View {
        ZStack{
            BackgroundView()
            NavigationView {
                VStack {
                    CategoryPicker(selectedTab: $selectedTab)
                    
                    DatePickerRange(startDate: $startDate, endDate: $endDate)
                    
                    HStack{
                        TextField("Genre", text: $genre)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .padding()
                            .font(.subheadline)
                        Button("Choose") {
                            /*@START_MENU_TOKEN@*//*@PLACEHOLDER=Action@*/ /*@END_MENU_TOKEN@*/
                        }
                    }

                    Menu {
                        ForEach(options, id: \.self) { option in
                        Button(option) {
                            selectedOption = option
                        }
                            }
                        } label: {
                            Text("Select Option: \(selectedOption)")
                                .foregroundColor(.indigo)
                                .padding()
                                .background(Color(.systemGray6))
                                .cornerRadius(5)
                                .font(.subheadline)
                            }
                        .padding()
                    
                    switch selectedTab {
                    case .albums:
                        AlbumsStatisticsView(startDate: startDate, endDate: endDate)
                    case .tracks:
                        TracksStatisticsView(startDate: startDate, endDate: endDate, viewModel: viewModel)
                    case .artists:
                        ArtistsStatisticsView(startDate: startDate, endDate: endDate)
                    }
                    
                    Spacer()
                }
                .padding()
                .navigationTitle("Welcome, \(username)").foregroundColor(.indigo)
                .navigationBarTitleDisplayMode(.automatic)
                .foregroundColor(.indigo)
            }
        }
    }
}

struct CategoryPicker: View {
    @Binding var selectedTab: StatisticCategory

    var body: some View {
        Picker("Statistics Type", selection: $selectedTab) {
            ForEach(StatisticCategory.allCases, id: \.self) { category in
                Text(category.rawValue).tag(category)
            }
        }
        .pickerStyle(SegmentedPickerStyle())
        .padding()
        
    }
}

struct DatePickerRange: View {
    @Binding var startDate: Date
    @Binding var endDate: Date


    var body: some View {
        VStack {
            DatePicker("Start Date", selection: $startDate, displayedComponents: .date)
                .datePickerStyle(CompactDatePickerStyle())
                .font(.subheadline)
            DatePicker("End Date", selection: $endDate, displayedComponents: .date)
                .datePickerStyle(CompactDatePickerStyle())
                .font(.subheadline)
        }
        .padding(.horizontal)
    }
}

enum StatisticCategory: String, CaseIterable {
    case albums = "Albums"
    case tracks = "Tracks"
    case artists = "Artists"
}

// Example Views for Each Category (Replace with actual content)
struct AlbumsStatisticsView: View {
    var startDate: Date
    var endDate: Date

    var body: some View {
        Text("Albums statistics view")
            .font(.subheadline)
        // Replace with your actual UI components for displaying albums statistics
    }
}

struct TracksStatisticsView: View {
    var startDate: Date
    var endDate: Date
  //@Binding var numItems: Int
      @ObservedObject var viewModel: HomeViewModel
  let userToken = SessionManager.shared.token

  var body: some View {
          VStack {
              Text("Songs statistics view")
                  .font(.subheadline)

              // Add UI components to input `numItems`, `startDate`, `endDate`, etc.
              // ...

              Button("Fetch Top Rated Tracks") {
                  let request = TopRatedTracksRequest(
                      filters: TopRatedTracksRequest.Filters(
                          rateDate: [dateFormatter.string(from: startDate), dateFormatter.string(from: endDate)],
                          releaseDate: [], // Adjust as needed
                          genres: [],      // Adjust as needed
                          artists: []      // Adjust as needed
                      )
                      //numItems: numItems
                  )
                  viewModel.fetchTopRatedTracks(userToken: userToken, requestBody: request)
              }
          }

          // Use viewModel.topRatedTracksResponse to display the fetched data
      }
  }

struct ArtistsStatisticsView: View {
    var startDate: Date
    var endDate: Date

    var body: some View {
        Text("Artists statistics view")
            .font(.subheadline)
        // Replace with your actual UI components for displaying ratings statistics
    }
}

var dateFormatter: DateFormatter {
    let formatter = DateFormatter()
    formatter.dateFormat = "yyyy-MM" // Adjust format as needed
    return formatter
}

#Preview {
    HomeView()
        .preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}

