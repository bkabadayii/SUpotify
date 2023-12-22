//
//  BarChartView2.swift
//  SUPotify Mobile App
//
//  Created by Alkım Özyüzer on 22.12.2023.
//

import SwiftUI
import Charts

/*
struct StepCount: Identifiable {
    let id = UUID()
    let weekday: Date
    let steps: Int

    init(day: String, steps: Int) {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyyMMdd"

        self.weekday = formatter.date(from: day) ?? Date.distantPast
        self.steps = steps
    }

    var weekdayString: String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyyMMdd"
        dateFormatter.dateStyle = .long
        dateFormatter.timeStyle = .none
        dateFormatter.locale = Locale(identifier: "en_US")
        return  dateFormatter.string(from: weekday)
    }
}


struct BarChartView2: View {
    let currentWeek: [StepCount] = [
        StepCount(day: "20220717", steps: 4200),
        StepCount(day: "20220718", steps: 15000),
        StepCount(day: "20220719", steps: 2800),
        StepCount(day: "20220720", steps: 10800),
        StepCount(day: "20220721", steps: 5300),
        StepCount(day: "20220722", steps: 10400),
        StepCount(day: "20220723", steps: 4000)
    ]

    var body: some View {
        VStack {
            GroupBox ( "Bar Chart - Step Count") {
                Chart(currentWeek) {
                    let steps = $0.steps
                    BarMark(
                        x: .value("Step Count", $0.steps),
                        y: .value("Week Day", $0.weekday, unit: .day)
                    )
                    .foregroundStyle(Color.indigo)
                    .annotation(position: .overlay, alignment: .trailing, spacing: 5) {
                        Text("\(steps)")
                            .font(.footnote)
                            .foregroundColor(.white)
                            .fontWeight(.bold)
                    }
                }
                .chartXAxis(.hidden)
                .chartYAxis {
                    AxisMarks (position: .leading, values: .stride (by: .day)) { value in
                        AxisValueLabel(format: .dateTime.weekday(),
                                       centered: true)
                    }
                }
            }
            .frame(height: 500)

            Spacer()
        }
        .padding()
    }
}


#Preview {
  BarChartView2().preferredColorScheme(/*@START_MENU_TOKEN@*/.dark/*@END_MENU_TOKEN@*/)
}
 */
