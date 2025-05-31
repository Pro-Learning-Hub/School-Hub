import React from 'react'
import TempStyledLectureEntry from './TempStyledLectureEntry'

export default function SectionModal({ handleCloseModal, selectedSection }) {
	return (
		<div
		className="modal fade show"
		tabIndex="-1"
		aria-labelledby="courseModalLabel"
		style={{display: 'block'}}
	>
		<div className="modal-dialog">
			<div className="modal-content">
				<div className="modal-header">
					<h5 className="modal-title" id="courseModalLabel">
						Course Chapter Details
					</h5>
					<button
						type="button"
						className="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
						onClick={handleCloseModal}
					></button>
				</div>
				<div className="modal-body">
					<h2 className="p-2">{selectedSection?.title}</h2>
					<p className="lead mb-2 p-2">
						{selectedSection?.description ||
							'No description available for this chapter.'}
					</p>

					<div className="list-group">
						{selectedSection?.lectures.map((lecture) => (
							<TempStyledLectureEntry
								lecture={lecture}
								sectionId={selectedSection.id}
								key={lecture.id}
							/>
						))}
					</div>
				</div>
				<div className="modal-footer">
					<button
						type="button"
						className="btn btn-secondary"
						onClick={handleCloseModal}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</div>
	)
}
