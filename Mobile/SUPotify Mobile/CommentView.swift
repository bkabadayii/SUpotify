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

struct PostCommentRequest: Codable {
    let contentType: String
    let relatedID: String
    let comment: String
}

struct SwitchLikeStatusRequest: Codable {
    let commentID: String
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

  func postComment(contentType: String, relatedID: String, comment: String, completion: @escaping (Bool, String?) -> Void) {
      let url = URL(string: "\(baseUrl)/commentContent")!
      var request = URLRequest(url: url)
      request.httpMethod = "POST"
      request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
      request.addValue("application/json", forHTTPHeaderField: "Content-Type")

      let postBody = PostCommentRequest(contentType: contentType, relatedID: relatedID, comment: comment)
      request.httpBody = try? JSONEncoder().encode(postBody)

      URLSession.shared.dataTask(with: request) { data, response, error in
          DispatchQueue.main.async {
              if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 201 {
                  completion(true, nil) // Success, no error message needed
              } else {
                  let errorMessage = error?.localizedDescription ?? "Failed to post comment"
                  completion(false, errorMessage)
              }
          }
      }.resume()
  }

  func deleteContentComment(commentID: String, contentType: String, relatedID: String, completion: @escaping (Bool) -> Void) {
      let url = URL(string: "\(baseUrl)/deleteComment")!
      var request = URLRequest(url: url)
      request.httpMethod = "DELETE"
      request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
      request.addValue("application/json", forHTTPHeaderField: "Content-Type")

      let body: [String: String] = [
          "commentID": commentID,
          "contentType": contentType,
          "relatedID": relatedID
      ]

      request.httpBody = try? JSONEncoder().encode(body)

      URLSession.shared.dataTask(with: request) { data, response, error in
        DispatchQueue.main.async {
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 204 {
                completion(true)
            } else {
                completion(false)
                if let httpResponse = response as? HTTPURLResponse {
                    print("Error deleting comment with status code: \(httpResponse.statusCode)")
                }
                if error != nil {
                    print("Error while deleting comment. Retry...")
                }
            }
        }
      }.resume()
  }


  func switchLikeStatus(commentID: String, completion: @escaping (Bool, String?) -> Void) {
      let url = URL(string: "\(baseUrl)/switchCommentLikeStatus")!
      var request = URLRequest(url: url)
      request.httpMethod = "POST"
      request.addValue("Bearer \(userToken)", forHTTPHeaderField: "Authorization")
      request.addValue("application/json", forHTTPHeaderField: "Content-Type")

      let likeBody = SwitchLikeStatusRequest(commentID: commentID)
      request.httpBody = try? JSONEncoder().encode(likeBody)

      URLSession.shared.dataTask(with: request) { data, response, error in
          DispatchQueue.main.async {
              if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
                  completion(true, nil) // Success, no error message needed
              } else {
                  let errorMessage = error?.localizedDescription ?? "Failed to switch like status"
                  completion(false, errorMessage)
              }
          }
      }.resume()
  }
}

struct CommentView: View {

  @State var comments: [Comment] = []
  @State private var newComment: String = ""
  @State private var isFetching = false
  @State private var navigationTitle: String = ""

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
      guard !newComment.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
          // Handle empty comment case, maybe show an alert
          return
      }

      CommentService().postComment(contentType: contentType, relatedID: contentID, comment: newComment) { success, errorMessage in
          if success {
              // Clear the comment field
              self.newComment = ""

              // Reload the comments to show the new one
              self.loadComments()
          } else if let errorMessage = errorMessage {
              // Handle the error, maybe show an alert with errorMessage
          }
      }
  }



  private func deleteComment(commentID: String) {
      CommentService().deleteContentComment(commentID: commentID, contentType: self.contentType, relatedID: self.contentID) { success in
          if success {
            self.comments.removeAll { $0._id == commentID }
            loadComments()
          } else {
            print("Error while deleting comment. Retry...")
            loadComments()
          }
      }
  }


  private func likeComment(commentID: String) {
      CommentService().switchLikeStatus(commentID: commentID) { success, errorMessage in
          if success {
              // Update the local state to reflect the new like status
              // You might want to find the comment in your `comments` array and toggle the `selfLike` property
              if let index = self.comments.firstIndex(where: { $0._id == commentID }) {
                  self.comments[index].selfLike?.toggle()
                  self.comments[index].totalLikes = (self.comments[index].selfLike == true) ? (self.comments[index].totalLikes ?? 0) + 1 : (self.comments[index].totalLikes ?? 0) - 1
                self.loadComments()
              }
          } else if let errorMessage = errorMessage {
              // Handle the error, maybe show an alert with errorMessage
            self.loadComments()
          }
      }
  }
  var body: some View {
          ZStack {
              // Layer 0
              BackgroundView()

              // Layer 1
              if isFetching {
                  LoadingView(isRotated: $isRotated) // Abstracted loading view
              } else {
                  commentsListView
              }
          }
          .onAppear {
              loadComments()
              setNavigationTitle()
          }
          .navigationTitle(navigationTitle)
          .navigationBarTitleDisplayMode(.inline)

      }

  private func setNavigationTitle() {
          switch contentType {
          case "TRACK":
              navigationTitle = "Comments of \(songName) by \(artistName)"
          case "ARTIST":
              navigationTitle = "Comments on \(songName)"
          case "ALBUM":
              navigationTitle = "Comments of \(songName) by \(artistName)"
          default:
              navigationTitle = "Comments"
          }
      }




  private var commentsListView: some View {
          VStack {
              List {
                  ForEach(comments) { comment in
                      CommentRow(comment: comment, likeAction: {
                          self.likeComment(commentID: comment._id)
                      }, deleteAction: {
                          self.deleteComment(commentID: comment._id)
                      })
                      .listRowBackground(Color.clear) // Ensure the background is clear
                  }
              }
              .listStyle(PlainListStyle())

              commentInputView // Abstracted input view
          }
      }

      // Abstract the input view for better readability and management
      private var commentInputView: some View {
          HStack {
              TextField("Write a comment...", text: $newComment)
                  .textFieldStyle(RoundedBorderTextFieldStyle())
                  .autocapitalization(.none)
                  .keyboardType(.default)

              Button("Post", action: postNewComment)
          }
          .padding()
      }
}


struct CommentRow: View {
    let comment: Comment
    let likeAction: () -> Void
    let deleteAction: () -> Void

    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(comment.username)
                    .fontWeight(.bold)
                Text(comment.commentContent)
                Text("Likes: \(comment.totalLikes ?? 0)")
                .font(.subheadline)
                .foregroundColor(.secondary)
            }
            Spacer()
            LikeButton(isLiked: comment.selfLike ?? false, action: likeAction)
            if comment.username == SessionManager.shared.username {
                DeleteButton(action: deleteAction)
            }
        }
    }
}

// Define a reusable like button component
struct LikeButton: View {
    let isLiked: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: isLiked ? "hand.thumbsup.fill" : "hand.thumbsup")
                .foregroundColor(isLiked ? .blue : .gray)
        }
        .buttonStyle(BorderlessButtonStyle()) // Make sure the button has no additional styling or padding
    }
}

// Define a reusable delete button component
struct DeleteButton: View {
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: "trash")
        }
        .buttonStyle(BorderlessButtonStyle()) // Make sure the button has no additional styling or padding
    }
}

// Define a loading view component
struct LoadingView: View {
    @Binding var isRotated: Bool

    var body: some View {
        Circle()
            .strokeBorder(AngularGradient(gradient: Gradient(colors: [.indigo, .blue, .purple, .orange, .red]),
                                          center: .center, angle: .zero), lineWidth: 15)
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
    }
}

extension Comment: Identifiable {
    public var id: String { self._id }
}

#Preview {
  CommentView(contentID: "", contentType: "TRACK", songName: "Songgg", artistName: "artistttt").preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}
