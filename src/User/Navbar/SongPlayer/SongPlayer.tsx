import React, { useEffect, useState } from "react";
import { SongApiModel, SongApiSchema } from "../../../DataModels/SongModel";
import SongRequest from "../../../API/SongRequest";

interface SongPlayerProps {
	id: string;
}
const SongPlayer: React.FC<SongPlayerProps> = ({ id }) => {
	const [song, setSong] = useState<SongApiModel>();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		if (!id) id = "4F6BA993-7F30-46A3-CAD7-08DD69D4467D"; // for testing
		const getSong = async () => {
			try {
				setIsLoading(true);
				const response = await SongRequest.getSongById(id);
				const validatedSong = SongApiSchema.safeParse(response.data);
				if (!validatedSong.success) {
					setError("Invalid song data");
					console.error(
						"🚀 ~ getCategories ~ validatedCategory.error:",
						validatedSong.error.issues
					);
					return;
				}
				if (validatedSong.success) {
					setSong(validatedSong.data);
				}
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching song:", error);
			}
		};
		getSong();
	}, []);

	return (
		<>
			{!song || isLoading ? (
				<div className="mt-4">
					{error && <p className="text-error">{error}</p>}
					<p>Loading ...</p>
				</div>
			) : (
				<div className="h-screen max-w-4xl mx-auto p-6 bg-base-100 shadow-lg rounded-lg border border-base-200 my-4">
					<div className="flex justify-center items-center mb-4">
						{song.songNumber && (
							<p className="text-3xl text-black opacity-50 mr-4">
								{String(song.songNumber).padStart(3, "0")}
							</p>
						)}
						<h1 className="text-3xl font-bold text-black text-center tracking-tight">
							{song.title}
						</h1>
					</div>
					{error && <p className="text-error">{error}</p>}

					{song.verses &&
						song.verses.$values.map((verse, verseIndex) => (
							<div key={verseIndex} className="mb-6">
								<h2 className="text-xl font-semibold text-center text-gray-700 my-2">
									Verse {String(verse.verseNumber).padStart(2, "0")}
								</h2>
								{verse.lyricLines &&
									verse.lyricLines.$values.map((line, lineIndex) => (
										<div key={lineIndex} className="flex flex-wrap gap-2 mb-2">
											{line.lyricSegments &&
												line.lyricSegments.$values.map(
													(segment, segmentIndex) => (
														<div
															key={segmentIndex}
															className="flex flex-col items-start"
														>
															{segment.chord && (
																<div className="chord text-sm text-blue-600 font-medium">
																	{segment.chord.chordName}
																</div>
															)}
															<div className="lyric text-gray-800 whitespace-pre">
																{segment.lyric}
															</div>
														</div>
													)
												)}
										</div>
									))}
							</div>
						))}
				</div>
			)}
		</>
	);
};

export default SongPlayer;
