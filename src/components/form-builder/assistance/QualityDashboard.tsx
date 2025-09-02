/**
 * QualityDashboard - Displays real-time form quality assessment
 *
 * This component provides a comprehensive view of form quality metrics including
 * usability, accessibility, performance, and security scores with improvement suggestions.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Badge } from 'primereact/badge'
import { Message } from 'primereact/message'
import { Divider } from 'primereact/divider'
// import { Tooltip } from 'primereact/tooltip'
import { Form } from '@/types'
import { FormMCP, FormQualityAssessment, FormImprovement } from '@/lib/mcp/implementations/FormMCP'

interface QualityDashboardProps {
	form: Form
	onImprovementSelect: (improvement: FormImprovement) => void
	className?: string
}

interface QualityMetricProps {
	label: string
	score: number
	description?: string
}

const QualityMetric: React.FC<QualityMetricProps> = ({ label, score, description }) => {
	// const getScoreColor = (score: number) => {
	// 	if (score >= 80) return 'text-green-500'
	// 	if (score >= 60) return 'text-yellow-500'
	// 	return 'text-red-500'
	// }

	const getScoreSeverity = (score: number) => {
		if (score >= 80) return 'success'
		if (score >= 60) return 'warning'
		return 'danger'
	}

	return (
		<div className="quality-metric mb-3">
			<div className="flex items-center justify-between mb-1">
				<span className="text-sm font-medium text-white">{label}</span>
				<Badge 
					value={`${score}/100`}
					severity={getScoreSeverity(score)}
					size="small"
				/>
			</div>
			<ProgressBar 
				value={score} 
				className="quality-progress"
				showValue={false}
			/>
			{description && (
				<p className="text-xs text-gray-400 mt-1 m-0">{description}</p>
			)}
		</div>
	)
}

interface ImprovementCardProps {
	improvement: FormImprovement
	onSelect: (improvement: FormImprovement) => void
}

const ImprovementCard: React.FC<ImprovementCardProps> = ({ improvement, onSelect }) => {
	const getImpactColor = (impact: string) => {
		switch (impact) {
			case 'high': return 'text-red-500'
			case 'medium': return 'text-yellow-500'
			case 'low': return 'text-green-500'
			default: return 'text-gray-500'
		}
	}

	const getImpactIcon = (impact: string) => {
		switch (impact) {
			case 'high': return 'pi pi-exclamation-triangle'
			case 'medium': return 'pi pi-info-circle'
			case 'low': return 'pi pi-check-circle'
			default: return 'pi pi-circle'
		}
	}

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'usability': return 'pi pi-user'
			case 'accessibility': return 'pi pi-universal-access'
			case 'performance': return 'pi pi-bolt'
			case 'security': return 'pi pi-shield'
			default: return 'pi pi-cog'
		}
	}

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'usability': return 'text-blue-500'
			case 'accessibility': return 'text-purple-500'
			case 'performance': return 'text-orange-500'
			case 'security': return 'text-red-500'
			default: return 'text-gray-500'
		}
	}

	return (
		<Card className="improvement-card mb-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(improvement)}>
			<div className="flex items-start justify-between">
				<div className="flex-1">
					<div className="flex items-center gap-2 mb-2">
						<i className={`${getTypeIcon(improvement.type)} ${getTypeColor(improvement.type)}`} />
						<h6 className="text-sm font-medium text-white m-0">{improvement.title}</h6>
						<Badge 
							value={improvement.impact}
							severity={improvement.impact === 'high' ? 'danger' : improvement.impact === 'medium' ? 'warning' : 'success'}
							size="small"
						/>
					</div>
					<p className="text-xs text-gray-400 mb-2">{improvement.description}</p>
					{improvement.action && (
						<div className="text-xs text-blue-400">
							<i className="pi pi-lightbulb mr-1" />
							{improvement.action}
						</div>
					)}
				</div>
				<div className="flex flex-col items-end gap-1">
					<Badge 
						value={improvement.effort}
						severity={improvement.effort === 'low' ? 'success' : improvement.effort === 'medium' ? 'warning' : 'danger'}
						size="small"
					/>
					<i className={`${getImpactIcon(improvement.impact)} ${getImpactColor(improvement.impact)} text-xs`} />
				</div>
			</div>
			<div className="flex justify-end mt-3">
				<Button
					label="Apply"
					icon="pi pi-check"
					size="small"
					className="p-button-sm p-button-outlined"
					onClick={(e) => {
						e.stopPropagation()
						onSelect(improvement)
					}}
				/>
			</div>
		</Card>
	)
}

const QualityDashboard: React.FC<QualityDashboardProps> = ({
	form,
	onImprovementSelect,
	className = '',
}) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [qualityAssessment, setQualityAssessment] = useState<FormQualityAssessment | null>(null)

	useEffect(() => {
		analyzeQuality()
	}, [form.fields, form.title, form.description])

	const analyzeQuality = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const result = await FormMCP.analyzeFormQuality(form)
			if (result.success && result.data) {
				setQualityAssessment(result.data)
			} else {
				setError('Failed to analyze form quality')
			}
		} catch (err) {
			console.error('Error analyzing form quality:', err)
			setError('Failed to analyze form quality')
		} finally {
			setLoading(false)
		}
	}, [form])

	const handleImprovementSelect = (improvement: FormImprovement) => {
		console.log('Improvement selected:', improvement)
		onImprovementSelect(improvement)
	}

	const getOverallScoreColor = (score: number) => {
		if (score >= 80) return 'text-green-500'
		if (score >= 60) return 'text-yellow-500'
		return 'text-red-500'
	}

	const getOverallScoreSeverity = (score: number) => {
		if (score >= 80) return 'success'
		if (score >= 60) return 'warning'
		return 'danger'
	}

	const getOverallScoreMessage = (score: number) => {
		if (score >= 80) return 'Excellent form quality!'
		if (score >= 60) return 'Good form quality with room for improvement'
		return 'Form needs significant improvements'
	}

	if (loading) {
		return (
			<Card className={`quality-dashboard ${className}`}>
				<div className="flex items-center justify-center p-4">
					<div className="text-center">
						<div className="spinner-border text-primary mb-2" role="status">
							<span className="sr-only">Loading...</span>
						</div>
						<p className="text-sm text-gray-400 m-0">Analyzing form quality...</p>
					</div>
				</div>
			</Card>
		)
	}

	return (
		<Card className={`quality-dashboard ${className}`}>
			<div className="quality-header mb-4">
				<div className="flex items-center justify-between mb-2">
					<h5 className="text-white m-0 flex items-center gap-2">
						<i className="pi pi-chart-line text-blue-500" />
						Form Quality Score
					</h5>
					<Button
						icon="pi pi-refresh"
						size="small"
						className="p-button-text p-button-sm"
						onClick={analyzeQuality}
						loading={loading}
					/>
				</div>
			</div>

			{error && (
				<Message 
					severity="error" 
					text={error}
					className="mb-4"
				/>
			)}

			{qualityAssessment && (
				<>
					{/* Overall Score */}
					<div className="overall-score mb-4">
						<div className="text-center p-4 bg-gray-800 rounded-lg">
							<div className="text-3xl font-bold text-white mb-1">
								{qualityAssessment.overall}
								<span className="text-lg text-gray-400">/100</span>
							</div>
							<ProgressBar 
								value={qualityAssessment.overall} 
								className="quality-progress mb-2"
								showValue={false}
							/>
							<p className={`text-sm font-medium m-0 ${getOverallScoreColor(qualityAssessment.overall)}`}>
								{getOverallScoreMessage(qualityAssessment.overall)}
							</p>
						</div>
					</div>

					{/* Quality Breakdown */}
					<div className="quality-breakdown mb-4">
						<h6 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
							<i className="pi pi-chart-bar text-gray-400" />
							Quality Breakdown
						</h6>
						<QualityMetric
							label="Usability"
							score={qualityAssessment.usability}
							description="How easy is your form to use and complete?"
						/>
						<QualityMetric
							label="Accessibility"
							score={qualityAssessment.accessibility}
							description="How accessible is your form to all users?"
						/>
						<QualityMetric
							label="Performance"
							score={qualityAssessment.performance}
							description="How fast does your form load and respond?"
						/>
						<QualityMetric
							label="Security"
							score={qualityAssessment.security}
							description="How secure is your form and data handling?"
						/>
					</div>

					{/* Improvement Suggestions */}
					{qualityAssessment.improvements.length > 0 && (
						<div className="improvements">
							<Divider />
							<div className="flex items-center gap-2 mb-3">
								<i className="pi pi-lightbulb text-yellow-500" />
								<h6 className="text-sm font-medium text-white m-0">Suggested Improvements</h6>
								<Badge value={qualityAssessment.improvements.length} severity="warning" size="small" />
							</div>
							<div className="improvements-list">
								{qualityAssessment.improvements.map((improvement, index) => (
									<ImprovementCard
										key={`improvement-${index}`}
										improvement={improvement}
										onSelect={handleImprovementSelect}
									/>
								))}
							</div>
						</div>
					)}

					{/* No Improvements Needed */}
					{qualityAssessment.improvements.length === 0 && (
						<div className="text-center p-4">
							<i className="pi pi-check-circle text-green-500 text-2xl mb-2" />
							<p className="text-sm text-gray-400 m-0">Your form quality is excellent! No improvements needed.</p>
						</div>
					)}
				</>
			)}

			{/* Form Stats */}
			<div className="form-stats mt-4">
				<Divider />
				<div className="grid grid-cols-2 gap-4 text-center">
					<div className="stat-item">
						<div className="text-lg font-bold text-white">{form.fields.length}</div>
						<div className="text-xs text-gray-400">Fields</div>
					</div>
					<div className="stat-item">
						<div className="text-lg font-bold text-white">
							{form.fields.filter(f => f.required).length}
						</div>
						<div className="text-xs text-gray-400">Required</div>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default QualityDashboard
