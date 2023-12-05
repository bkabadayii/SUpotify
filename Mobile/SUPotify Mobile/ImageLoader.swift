//
//  ImageLoader.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 17.11.2023.
//

import SwiftUI
import Combine

class ImageLoader: ObservableObject {
    @Published var image: UIImage?
    private var cancellables = Set<AnyCancellable>()

    func load(fromURLString urlString: String) {
        guard let url = URL(string: urlString) else {
            return
        }

        URLSession.shared.dataTaskPublisher(for: url)
            .map { UIImage(data: $0.data) }
            .replaceError(with: nil)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] in self?.image = $0 }
            .store(in: &cancellables)
    }
}

struct ImageView: View {
    @ObservedObject private var imageLoader = ImageLoader()
    let urlString: String

    init(urlString: String) {
        self.urlString = urlString
        imageLoader.load(fromURLString: urlString)
    }

    var body: some View {
        if let image = imageLoader.image {
            Image(uiImage: image)
                .resizable()
                // Add your desired frame and other modifiers
        } else {
            // Placeholder or loading view
            //Text("Loading...")
            Image(systemName: "music.note")
                .resizable()
                .frame(width: 20, height: 31)
        }
    }
}
