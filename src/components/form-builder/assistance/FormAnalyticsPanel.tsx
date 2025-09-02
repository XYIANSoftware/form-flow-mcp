'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Message } from 'primereact/message'
import { TabView, TabPanel } from 'primereact/tabview'
import { ProgressBar } from 'primereact/progressbar'
import { Badge } from 'primereact/badge'
import { Chart } from 'primereact/chart'
import { FormField, Form } from '@/types'
import {
	FormAnalyticsMCP,
	FormAnalytics,
	AnalyticsInsight,
	PredictiveInsight,
	BenchmarkComparison,
} from '@/lib/mcp'

interface FormAnalyticsPanelProps {
	form: Form
	fields: FormField[]
	className?: string
}

export default function FormAnalyticsPanel({
	form,
	fields,
	className = '',
}: FormAnalyticsPanelProps) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [analytics, setAnalytics] = useState<FormAnalytics | null>(null)
	const [insights, setInsights] = useState<AnalyticsInsight[]>([])
	const [predictions, setPredictions] = useState<PredictiveInsight[]>([])
	const [benchmarks, setBenchmarks] = useState<BenchmarkComparison | null>(null)

	const analyticsMCP = new FormAnalyticsMCP()

	const analyzeForm = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			// Analyze form performance
			const analyticsResult = await analyticsMCP.analyzeFormPerformance(form)
			if (analyticsResult.success && analyticsResult.data) {
				setAnalytics(analyticsResult.data)

				// Generate insights
				const insightsResult = await analyticsMCP.generateActionableInsights(analyticsResult.data)
				if (insightsResult.success && insightsResult.data) {
					setInsights(insightsResult.data)
				}

				// Generate predictions
				const predictionsResult = await analyticsMCP.generatePredictiveInsights(analyticsResult.data)
				if (predictionsResult.success && predictionsResult.data) {
					setPredictions(predictionsResult.data)
				}

				// Compare with benchmarks
				const benchmarksResult = await analyticsMCP.compareWithBenchmarks(analyticsResult.data)
				if (benchmarksResult.success && benchmarksResult.data) {
					setBenchmarks(benchmarksResult.data)
				}
			} else {
				setError('Failed to analyze form performance')
			}
		} catch (err) {
			setError('Error analyzing form: ' + (err as Error).message)
		} finally {
			setLoading(false)
		}
	}, [form, analyticsMCP])

	useEffect(() => {
		if (form && fields.length > 0) {
			analyzeForm()
		}
	}, [form, fields, analyzeForm])

	const getImpactColor = (impact: string) => {
		switch (impact) {
			case 'high':
				return 'danger'
			case 'medium':
				return 'warning'
			case 'low':
				return 'info'
			default:
				return 'info'
		}
	}

	const getPerformanceColor = (performance: string) => {
		switch (performance) {
			case 'above':
				return 'success'
			case 'below':
				return 'danger'
			case 'at':
				return 'info'
			default:
				return 'info'
		}
	}

	const chartData = {
		labels: ['Desktop', 'Mobile', 'Tablet'],
		datasets: [
			{
				data: analytics?.userBehavior.deviceBreakdown
					? [
							analytics.userBehavior.deviceBreakdown.desktop * 100,
							analytics.userBehavior.deviceBreakdown.mobile * 100,
							analytics.userBehavior.deviceBreakdown.tablet * 100,
					  ]
					: [60, 35, 5],
				backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
				hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D'],
			},
		],
	}

	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				labels: {
					color: '#ffffff',
				},
			},
		},
	}

	if (loading) {
		return (
			<Card className={`h-full ${className}`}>
				<div className='p-4 text-center'>
					<ProgressSpinner />
					<p className='mt-4 text-gray-300'>Analyzing form performance...</p>
				</div>
			</Card>
		)
	}

	if (error) {
		return (
			<Card className={`h-full ${className}`}>
				<div className='p-4'>
					<Message severity='error' text={error} />
					<Button
						label='Retry Analysis'
						icon='pi pi-refresh'
						onClick={analyzeForm}
						className='mt-4'
					/>
				</div>
			</Card>
		)
	}

	return (
		<Card className={`h-full ${className}`}>
			<div className='p-4 border-b border-gray-600'>
				<div className='flex items-center justify-between'>
					<div>
						<h3 className='text-lg font-semibold text-white mb-1'>
							Form Analytics
						</h3>
						<p className='text-sm text-gray-400'>
							Performance insights and optimization recommendations
						</p>
					</div>
					<Button
						icon='pi pi-refresh'
						onClick={analyzeForm}
						className='p-button-outlined p-button-sm'
						tooltip='Refresh Analysis'
					/>
				</div>
			</div>

			<div className='p-4'>
				<TabView>
					<TabPanel header='Overview' leftIcon='pi pi-chart-bar'>
						{analytics && (
							<div className='space-y-6'>
								{/* Key Metrics */}
								<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
									<div className='bg-gray-800 p-4 rounded-lg'>
										<div className='text-2xl font-bold text-white'>
											{analytics.totalViews}
										</div>
										<div className='text-sm text-gray-400'>Total Views</div>
									</div>
									<div className='bg-gray-800 p-4 rounded-lg'>
										<div className='text-2xl font-bold text-white'>
											{analytics.totalSubmissions}
										</div>
										<div className='text-sm text-gray-400'>Submissions</div>
									</div>
									<div className='bg-gray-800 p-4 rounded-lg'>
										<div className='text-2xl font-bold text-white'>
											{Math.round(analytics.completionRate * 100)}%
										</div>
										<div className='text-sm text-gray-400'>Completion Rate</div>
									</div>
									<div className='bg-gray-800 p-4 rounded-lg'>
										<div className='text-2xl font-bold text-white'>
											{Math.round(analytics.averageCompletionTime / 60)}m
										</div>
										<div className='text-sm text-gray-400'>Avg. Time</div>
									</div>
								</div>

								{/* Performance Metrics */}
								<div className='bg-gray-800 p-4 rounded-lg'>
									<h4 className='text-lg font-medium text-white mb-4'>
										Performance Metrics
									</h4>
									<div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
										<div>
											<div className='text-sm text-gray-400 mb-1'>Load Time</div>
											<div className='text-lg font-semibold text-white'>
												{analytics.performanceMetrics.loadTime.toFixed(1)}s
											</div>
										</div>
										<div>
											<div className='text-sm text-gray-400 mb-1'>Form Size</div>
											<div className='text-lg font-semibold text-white'>
												{analytics.performanceMetrics.formSize} KB
											</div>
										</div>
										<div>
											<div className='text-sm text-gray-400 mb-1'>Complexity</div>
											<div className='text-lg font-semibold text-white'>
												{analytics.performanceMetrics.complexityScore}/100
											</div>
										</div>
									</div>
								</div>

								{/* Device Breakdown */}
								<div className='bg-gray-800 p-4 rounded-lg'>
									<h4 className='text-lg font-medium text-white mb-4'>
										Device Usage
									</h4>
									<div className='h-64'>
										<Chart
											type='doughnut'
											data={chartData}
											options={chartOptions}
										/>
									</div>
								</div>
							</div>
						)}
					</TabPanel>

					<TabPanel header='Insights' leftIcon='pi pi-lightbulb'>
						<div className='space-y-4'>
							{insights.map(insight => (
								<InsightCard key={insight.id} insight={insight} />
							))}
						</div>
					</TabPanel>

					<TabPanel header='Predictions' leftIcon='pi pi-eye'>
						<div className='space-y-4'>
							{predictions.map(prediction => (
								<PredictionCard key={prediction.id} prediction={prediction} />
							))}
						</div>
					</TabPanel>

					<TabPanel header='Benchmarks' leftIcon='pi pi-chart-line'>
						{benchmarks && (
							<div className='space-y-4'>
								<div className='bg-gray-800 p-4 rounded-lg'>
									<h4 className='text-lg font-medium text-white mb-4'>
										Overall Performance Score
									</h4>
									<div className='text-3xl font-bold text-white mb-2'>
										{benchmarks.overallScore}/100
									</div>
									<ProgressBar
										value={benchmarks.overallScore}
										className='h-2'
									/>
								</div>

								<div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
									<BenchmarkMetric
										title='Completion Rate'
										metric={benchmarks.completionRate}
										format='percentage'
									/>
									<BenchmarkMetric
										title='Average Time'
										metric={benchmarks.averageTime}
										format='time'
									/>
									<BenchmarkMetric
										title='Field Count'
										metric={benchmarks.fieldCount}
										format='number'
									/>
								</div>
							</div>
						)}
					</TabPanel>

					<TabPanel header='Drop-off Analysis' leftIcon='pi pi-exclamation-triangle'>
						{analytics && (
							<div className='space-y-4'>
								{analytics.dropOffPoints.map(dropOff => (
									<DropOffCard key={dropOff.fieldId} dropOff={dropOff} />
								))}
							</div>
						)}
					</TabPanel>
				</TabView>
			</div>
		</Card>
	)
}

// Helper Components
interface InsightCardProps {
	insight: AnalyticsInsight
}

function InsightCard({ insight }: InsightCardProps) {
	return (
		<Card className='bg-gray-800 border-gray-700'>
			<div className='p-4'>
				<div className='flex items-start justify-between mb-3'>
					<div>
						<h5 className='text-lg font-medium text-white mb-1'>
							{insight.title}
						</h5>
						<p className='text-sm text-gray-300'>{insight.description}</p>
					</div>
					<Badge
						value={insight.impact}
						severity={getImpactColor(insight.impact)}
					/>
				</div>

				<div className='mb-3'>
					<div className='text-sm text-gray-400 mb-1'>Confidence</div>
					<ProgressBar value={insight.confidence * 100} className='h-2' />
				</div>

				<div>
					<div className='text-sm text-gray-400 mb-2'>Recommendations</div>
					<ul className='space-y-1'>
						{insight.recommendations.map((rec, index) => (
							<li key={index} className='text-sm text-gray-300 flex items-center'>
								<i className='pi pi-check text-green-400 mr-2' />
								{rec}
							</li>
						))}
					</ul>
				</div>
			</div>
		</Card>
	)
}

interface PredictionCardProps {
	prediction: PredictiveInsight
}

function PredictionCard({ prediction }: PredictionCardProps) {
	return (
		<Card className='bg-gray-800 border-gray-700'>
			<div className='p-4'>
				<div className='flex items-start justify-between mb-3'>
					<div>
						<h5 className='text-lg font-medium text-white mb-1'>
							{prediction.title}
						</h5>
						<p className='text-sm text-gray-300'>{prediction.description}</p>
					</div>
					<div className='text-right'>
						<div className='text-2xl font-bold text-white'>
							{Math.round(prediction.prediction * 100)}%
						</div>
						<div className='text-xs text-gray-400'>Prediction</div>
					</div>
				</div>

				<div className='mb-3'>
					<div className='text-sm text-gray-400 mb-1'>Confidence</div>
					<ProgressBar value={prediction.confidence * 100} className='h-2' />
				</div>

				<div>
					<div className='text-sm text-gray-400 mb-2'>Key Factors</div>
					<div className='flex flex-wrap gap-2'>
						{prediction.factors.map((factor, index) => (
							<Badge key={index} value={factor} severity='info' />
						))}
					</div>
				</div>
			</div>
		</Card>
	)
}

interface BenchmarkMetricProps {
	title: string
	metric: { current: number; benchmark: number; performance: string }
	format: 'percentage' | 'time' | 'number'
}

function BenchmarkMetric({ title, metric, format }: BenchmarkMetricProps) {
	const formatValue = (value: number) => {
		switch (format) {
			case 'percentage':
				return `${Math.round(value * 100)}%`
			case 'time':
				return `${Math.round(value / 60)}m`
			case 'number':
				return value.toString()
			default:
				return value.toString()
		}
	}

	return (
		<Card className='bg-gray-800 border-gray-700'>
			<div className='p-4'>
				<h5 className='text-lg font-medium text-white mb-3'>{title}</h5>
				<div className='space-y-2'>
					<div className='flex justify-between'>
						<span className='text-sm text-gray-400'>Current</span>
						<span className='text-sm text-white'>{formatValue(metric.current)}</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-sm text-gray-400'>Benchmark</span>
						<span className='text-sm text-white'>{formatValue(metric.benchmark)}</span>
					</div>
					<div className='flex justify-between items-center'>
						<span className='text-sm text-gray-400'>Performance</span>
						<Badge
							value={metric.performance}
							severity={getPerformanceColor(metric.performance)}
						/>
					</div>
				</div>
			</div>
		</Card>
	)
}

interface DropOffCardProps {
	dropOff: {
		fieldId: string
		fieldLabel: string
		dropOffCount: number
		dropOffRate: number
		commonReasons: string[]
		suggestions: string[]
	}
}

function DropOffCard({ dropOff }: DropOffCardProps) {
	return (
		<Card className='bg-gray-800 border-gray-700'>
			<div className='p-4'>
				<div className='flex items-start justify-between mb-3'>
					<div>
						<h5 className='text-lg font-medium text-white mb-1'>
							{dropOff.fieldLabel}
						</h5>
						<p className='text-sm text-gray-400'>Field ID: {dropOff.fieldId}</p>
					</div>
					<div className='text-right'>
						<div className='text-2xl font-bold text-red-400'>
							{Math.round(dropOff.dropOffRate * 100)}%
						</div>
						<div className='text-xs text-gray-400'>Drop-off Rate</div>
					</div>
				</div>

				<div className='mb-3'>
					<div className='text-sm text-gray-400 mb-1'>
						Drop-off Count: {dropOff.dropOffCount}
					</div>
					<ProgressBar value={dropOff.dropOffRate * 100} className='h-2' />
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
					<div>
						<div className='text-sm text-gray-400 mb-2'>Common Reasons</div>
						<ul className='space-y-1'>
							{dropOff.commonReasons.map((reason, index) => (
								<li key={index} className='text-sm text-gray-300 flex items-center'>
									<i className='pi pi-times text-red-400 mr-2' />
									{reason}
								</li>
							))}
						</ul>
					</div>
					<div>
						<div className='text-sm text-gray-400 mb-2'>Suggestions</div>
						<ul className='space-y-1'>
							{dropOff.suggestions.map((suggestion, index) => (
								<li key={index} className='text-sm text-gray-300 flex items-center'>
									<i className='pi pi-check text-green-400 mr-2' />
									{suggestion}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</Card>
	)
}

function getImpactColor(impact: string) {
	switch (impact) {
		case 'high':
			return 'danger'
		case 'medium':
			return 'warning'
		case 'low':
			return 'info'
		default:
			return 'info'
	}
}

function getPerformanceColor(performance: string) {
	switch (performance) {
		case 'above':
			return 'success'
		case 'below':
			return 'danger'
		case 'at':
			return 'info'
		default:
			return 'info'
	}
}
