//
//  HomeView.swift
//  SUPotify Mobile App
//
//  Created by Deniz Özdemir on 12/6/23.
//

import SwiftUI
import Charts

struct TopRatedTracksRequest: Codable {
    let filters: Filters
    let numItems: Int
}

struct Filters: Codable {
    let rateDate: [String]
    let releaseDate: [String]
    let genres: [String]
    let artists: [Artists]
}

struct TopRatedTracksResponse: Codable {
    var message: String
    var success: Bool
    var trackRatings: [TrackRating]
    
    struct TrackRating: Codable {
        struct Track: Codable {
            var _id: String
            var name: String
            var popularity: Int
            var durationMS: Int
            var album: Album
            var artists: [String]
            var spotifyID: String
            var spotifyURL: String
            var previewURL: String
        }
        
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
    }
}
    
struct HomeView: View {
       // @StateObject var viewModel = HomeViewModel() // ViewModel instance
        @State private var selectedTab: StatisticCategory = .albums
        @State private var startDate: Date = Calendar.current.date(byAdding: .year, value: -1, to: Date()) ?? Date()
        @State private var endDate: Date = Date()
        @State private var genre: String = "" // Provide a default value
        @State private var artists: String = "" // Provide a default value
        @State private var selectedOption: String = "Ranking based"
        let username = SessionManager.shared.username
        let userToken = SessionManager.shared.token
        let options = ["Ranking based", "Liked Songs based"]
        
        var body: some View {
            ZStack{
                BackgroundView()
                    VStack {
                        CategoryPicker(selectedTab: $selectedTab)
                        
                        DatePickerRange(startDate: $startDate, endDate: $endDate)
                        
                        HStack{
                            TextField("Genre", text: $genre)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .padding()
                                .font(.subheadline)
                            TextField("Artists", text: $artists)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                                .padding()
                                .font(.subheadline)
                        }
                        
                        Menu {
                            ForEach(options, id: \.self) { option in
                                Button(option) {
                                    selectedOption = option
                                }
                            }
                        } label: {
                            Text("Select Option: \(selectedOption)")
                                .foregroundColor(.white)
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
                            TracksStatisticsView(startDate: startDate, endDate: endDate, genre: genre, artists: artists)
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
/*
    class HomeViewModel: ObservableObject {
        @Published var topRatedTracksResponse: TopRatedTracksResponse?
        
        func fetchTopRatedTracks(userToken: String, requestBody: TopRatedTracksRequest) {
            let requestBody = TopRatedTracksRequest(
                filters: Filters(
                    rateDate: [dateFormatter.string(from: startDate), dateFormatter.string(from: endDate)],
                    releaseDate: [dateFormatter.string(from: startDate), dateFormatter.string(from: endDate)],
                    genres: [genre],
                    artists: [] // Assuming you have a way to specify artists
                ),
                numItems: numItems
            )
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
    }*/
    
    
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
    
  /*  struct BarChartView: View {
        var trackRatings: [TopRatedTracksResponse.TrackRating]
        
        var body: some View {
            HStack(alignment: .bottom, spacing: 2) {
                ForEach(trackRatings) { rating in
                    VStack {
                        Text("\(rating.track.popularity)")
                            .font(.caption)
                        Rectangle()
                            .fill(Color.blue)
                            .frame(width: 20, height: CGFloat(rating.track.popularity))
                        Text(rating.track.name)
                            .font(.caption)
                            .lineLimit(1)
                    }
                }
            }
        }
    }*/
    
    
    struct DatePickerRange: View {
        @Binding var startDate: Date
        @Binding var endDate: Date
        
        
        var body: some View {
            VStack {
                DatePicker("Start Date", selection: $startDate, displayedComponents: .date)
                    .datePickerStyle(CompactDatePickerStyle())
                    .font(.subheadline)
                    .foregroundColor(.white)
                DatePicker("End Date", selection: $endDate, displayedComponents: .date)
                    .datePickerStyle(CompactDatePickerStyle())
                    .font(.subheadline)
                    .foregroundColor(.white)
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
            
            // Replace with your actual UI components for displaying albums statistics
            Button("Calculate") {
              /*  let filters = Filters(
                    rateDate: [dateFormatter.string(from: startDate), dateFormatter.string(from: endDate)],
                    releaseDate: [dateFormatter.string(from: startDate), dateFormatter.string(from: endDate)],
                    genres: [genre],
                    artists: [artists]
                )
                let request = TopRatedTracksRequest(filters: filters, numItems: 10)
                viewModel.fetchTopRatedTracks(userToken: userToken, requestBody: request)*/
            }
            .font(.subheadline)
            .padding()
            .background(.black.opacity(0.5))
            .foregroundColor(.white)
            .font(.caption2)
            .cornerRadius(8)
            Text("Albums statistics view")
                .font(.subheadline)
        }
    }
    
    struct TracksStatisticsView: View {
        var startDate: Date
        var endDate: Date
        var genre: String
        var artists: String
       // @ObservedObject var viewModel: HomeViewModel
        let userToken = SessionManager.shared.token
        
        var body: some View {
            VStack {
                
                Button("Calculate") {
                  /*  let filters = Filters(
                        rateDate: [dateFormatter.string(from: startDate), dateFormatter.string(from: endDate)],
                        releaseDate: [dateFormatter.string(from: startDate), dateFormatter.string(from: endDate)],
                        genres: [genre],
                        artists: [artists]
                    )
                    let request = TopRatedTracksRequest(filters: filters, numItems: 10)
                    viewModel.fetchTopRatedTracks(userToken: userToken, requestBody: request)*/
                }.font(.subheadline)
                    .padding()
                    .background(.black.opacity(0.5))
                    .foregroundColor(.white)
                    .font(.caption2)
                    .cornerRadius(8)
                Text("Songs statistics view")
                    .font(.subheadline)
                
               
            }
            // Add BarChartView here
        }
        var dateFormatter: DateFormatter {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM" // Adjust format as needed
            return formatter
        }
    }
        
        struct ArtistsStatisticsView: View {
            var startDate: Date
            var endDate: Date
            
            var body: some View {
                Button("Calculate") {
                  /*  let filters = Filters(
                        rateDate: [dateFormatter.string(from: startDate), dateFormatter.string(from: endDate)],
                        releaseDate: [dateFormatter.string(from: startDate), dateFormatter.string(from: endDate)],
                        genres: [genre],
                        artists: [artists]
                    )
                    let request = TopRatedTracksRequest(filters: filters, numItems: 10)
                    viewModel.fetchTopRatedTracks(userToken: userToken, requestBody: request)*/
                }
                .font(.subheadline)
                .padding()
                .background(.black.opacity(0.5))
                .foregroundColor(.white)
                .font(.caption2)
                .cornerRadius(8)
                
                Text("Artists statistics view")
                    .font(.subheadline)
            }
        }
        
    
#Preview {
    HomeView()
        .preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}
