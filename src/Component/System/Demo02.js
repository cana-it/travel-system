import React, { useState, useEffect, useRef } from "react";
import { TinyMCE } from '../../Common'
export const Demo02 = () => {


	// chạy sau khi tạo ra giao diện

	useEffect(() => {
		//functionA(1,2);

	}, [])

	const options = {
		backgroundColor: "#F5DEB3",
		title: {
			text: "Basic Column Chart"
		},
		subtitles: [
			{
				text: "This is a Subtitle"
			}
		],
		dataPointWidth: 20,
		height: 320,
		zoomEnabled: true,
		zoomType: "xy",
		animationEnabled: true,
		animationDuration: 2000,
		toolTip: {
			enabled: true   //enable here
		},
		data: [
			{
				// Change type to "doughnut", "line", "splineArea", etc.
				type: "column",
				dataPoints: [
					{ label: "Apple", y: 10, color: "red" },
					{ label: "Orange", y: 15, color: "red" },
					{ label: "Banana", y: 25, color: "red" },
					{ label: "Mango", y: 30, color: "red" },
					{ label: "Grape", y: 28, color: "red" },
					{ label: "Apple", y: 10, color: "red" },
					{ label: "Orange", y: 15, color: "red" },
					{ label: "Banana", y: 25, color: "red" },
					{ label: "Mango", y: 30, color: "red" },
					{ label: "Grape", y: 28, color: "red" },
					{ label: "Apple", y: 10, color: "red" },
					{ label: "Orange", y: 15, color: "red" },
					{ label: "Banana", y: 25, color: "red" },
					{ label: "Mango", y: 30, color: "red" },
					{ label: "Grape", y: 28, color: "red" },
					{ label: "Apple", y: 10, color: "red" },
					{ label: "Orange", y: 15, color: "red" },
					{ label: "Banana", y: 25, color: "red" },
					{ label: "Mango", y: 30, color: "red" },
					{ label: "Grape", y: 28, color: "red" }
				]
			}
		]
	}


	return (
		<>

			<div id="chart" className="content-wrapper">
				<div>
					<TinyMCE height={200} />
				</div>

				{/* <CanvasJSChart options = {options}/> */}


			</div>
		</>
	)
}