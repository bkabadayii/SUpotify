//
//  CommentView.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 24.12.2023.
//

import SwiftUI

struct Comment: Codable {
  var _id: String
  var username: String
  var commentContent: String
  var commentedAt: String?
  var totalLikes: Int?
  var selfLike: Bool?
}

struct CommentResponse: Codable {
  var message: String
  var success: Bool
  var allComments: [Comment]?
}



class CommentService {
  private let baseUrl = "http://localhost:4000/api/comments"
  private let userToken = SessionManager.shared.token

  func getContentComments (contentID: String, contentType: String, completion: @escaping (CommentResponse?) -> Void) {

    let url = URL(string: "\(baseUrl)/getContentComments/\(contentType)/\(contentID)")!
    var request = URLRequest(url: url)
    request.httpMethod = "GET"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")


    URLSession.shared.dataTask(with: request) { data, response, error in
      DispatchQueue.main.async {
        guard let data = data, error == nil else {
          completion(nil)
          return
        }

        let response = try? JSONDecoder().decode(CommentResponse.self, from: data)
        completion(response)
      }
    }.resume()
  }

  func postComment () {
    let url = URL(string: "\(baseUrl)/commentContent")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")


  }

  func deleteContentComment () {
    let url = URL(string: "\(baseUrl)/deleteComment")!
    var request = URLRequest(url: url)
    request.httpMethod = "DELETE"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")


  }

  func switchLikeStatus () {
    let url = URL(string: "\(baseUrl)/switchCommentLikeStatus")!
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")



  }

}

struct CommentView: View {

  @State var comments: [Comment] = []
  @State private var newComment: String = ""
  @State private var isFetching = false

  @State var isRotated: Bool = false
  var contentID: String
  var contentType: String
  var songName: String
  var artistName: String


  private func loadComments() {
      isFetching = true
      CommentService().getContentComments(contentID: contentID, contentType: contentType) { response in
          if let comments = response?.allComments {
              self.comments = comments
          }
          isFetching = false
      }
  }


  private func postNewComment() {
      // Call CommentService to post the new comment
      // Clear newComment after posting
  }


  private func deleteComment(commentID: String) {
      // Call CommentService to delete the comment
      // Remove comment from local comments array
  }


  private func likeComment(commentID: String) {
      // Call CommentService to like the comment
      // Update local comments array accordingly
  }


  var body: some View {

      ZStack{

        //Layer 0
        BackgroundView()

        // Layer 1
        if (isFetching) {
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
        } else {
          VStack {
              List {
                ForEach(comments) { comment in
                      HStack {
                          VStack(alignment: .leading) {
                              Text(comment.username)
                                  .fontWeight(.bold)
                              Text(comment.commentContent)
                              Text("Likes: \(comment.totalLikes ?? 0)")
                          }

                          Spacer()

                          Button(action: {
                              self.likeComment(commentID: comment.id)
                          }) {
                              Image(systemName: comment.selfLike == true ? "hand.thumbsup.fill" : "hand.thumbsup")
                                  .foregroundColor(comment.selfLike == true ? .blue : .gray)
                          }

                          if comment.username == SessionManager.shared.username {
                              Button(action: {
                                self.deleteComment(commentID: comment._id)
                              }) {
                                  Image(systemName: "trash")
                              }
                          }
                      }
                  }
              }

              HStack {
                  TextField("Write a comment...", text: $newComment)
                      .textFieldStyle(RoundedBorderTextFieldStyle())

                  Button("Post", action: postNewComment)
              }.padding()
          }
        }

      //.navigationTitle("Comments of \(songName) by \(artistName)")
      //.navigationBarTitleDisplayMode(.inline)
    }
  }
}

extension Comment: Identifiable {
    public var id: String { self._id }
}

#Preview {
  CommentView(contentID: "", contentType: "TRACK", songName: "Songgg", artistName: "artistttt").preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}
