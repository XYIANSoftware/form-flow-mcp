/**
 * ContextualHelpPanel - Provides context-aware help and guidance
 *
 * This component displays relevant help content based on the current user context,
 * including step-by-step instructions, related topics, and actionable guidance.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Badge } from 'primereact/badge'
import { Message } from 'primereact/message'
import { Divider } from 'primereact/divider'
// import { Tooltip } from 'primereact/tooltip'
// import { FormField, Form } from '@/types'
import {
	FormAssistanceMCP,
	HelpContent,
	HelpAction,
	UserContext,
} from '@/lib/mcp/implementations/FormAssistanceMCP'

interface ContextualHelpPanelProps {
	userContext: UserContext
	onHelpAction: (action: HelpAction) => void
	className?: string
}

interface HelpStepProps {
	step: string
	index: number
}

const HelpStep: React.FC<HelpStepProps> = ({ step, index }) => {
	return (
		<div className='help-step flex items-start gap-3 mb-3'>
			<div className='step-number flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium'>
				{index + 1}
			</div>
			<div className='step-content flex-1'>
				<p className='text-sm text-gray-300 m-0'>{step}</p>
			</div>
		</div>
	)
}

interface HelpActionButtonProps {
	action: HelpAction
	onClick: (action: HelpAction) => void
}

const HelpActionButton: React.FC<HelpActionButtonProps> = ({
	action,
	onClick,
}) => {
	const getActionSeverity = (type: string) => {
		switch (type) {
			case 'apply':
				return 'success'
			case 'navigate':
				return 'info'
			case 'dismiss':
				return 'secondary'
			case 'close':
				return 'secondary'
			default:
				return 'info'
		}
	}

	const getActionIcon = (type: string) => {
		switch (type) {
			case 'apply':
				return 'pi pi-check'
			case 'navigate':
				return 'pi pi-arrow-right'
			case 'dismiss':
				return 'pi pi-times'
			case 'close':
				return 'pi pi-times'
			default:
				return 'pi pi-info-circle'
		}
	}

	return (
		<Button
			label={action.label}
																icon={action.icon || getActionIcon(action.type)}
													size='small'
													className='p-button-sm'
			severity={getActionSeverity(action.type)}
			onClick={() => onClick(action)}
		/>
	)
}

const ContextualHelpPanel: React.FC<ContextualHelpPanelProps> = ({
	userContext,
	onHelpAction,
	className = '',
}) => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [helpContent, setHelpContent] = useState<HelpContent | null>(null)
	const [isVisible, setIsVisible] = useState(true)

	const loadContextualHelp = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const result = await FormAssistanceMCP.provideContextualHelp(userContext)
			if (result.success && result.data) {
				setHelpContent(result.data)
			} else {
				setError('Failed to load contextual help')
			}
		} catch (err) {
			console.error('Error loading contextual help:', err)
			setError('Failed to load contextual help')
		} finally {
			setLoading(false)
		}
	}, [userContext])

	useEffect(() => {
		loadContextualHelp()
	}, [
		userContext.currentAction,
		userContext.currentField,
		userContext.currentForm,
		loadContextualHelp,
	])

	const handleHelpAction = (action: HelpAction) => {
		console.log('Help action triggered:', action)
		onHelpAction(action)

		// Handle specific actions
		switch (action.type) {
			case 'close':
			case 'dismiss':
				setIsVisible(false)
				break
			case 'apply':
				// Handle apply action based on action.action
				if (action.action === 'add-sample-field') {
					console.log('Adding sample field...')
					// Implement sample field addition
				} else if (action.action === 'show-field-palette') {
					console.log('Showing field palette...')
					// Implement field palette display
				}
				break
			case 'navigate':
				// Handle navigation action
				if (action.action === 'show-tutorial') {
					console.log('Showing tutorial...')
					// Implement tutorial display
				}
				break
		}
	}

	const handleClose = () => {
		setIsVisible(false)
		handleHelpAction({ type: 'close', label: 'Close' })
	}

	if (!isVisible) {
		return (
			<Card className={`contextual-help-panel ${className}`}>
				<div className='text-center p-4'>
					<Button
																			label='Show Help'
													icon='pi pi-question-circle'
													size='small'
													className='p-button-text'
						onClick={() => setIsVisible(true)}
					/>
				</div>
			</Card>
		)
	}

	if (loading) {
		return (
			<Card className={`contextual-help-panel ${className}`}>
				<div className='flex items-center justify-center p-4'>
					<div className='text-center'>
						<div className='spinner-border text-primary mb-2' role='status'>
							<span className='sr-only'>Loading...</span>
						</div>
						<p className='text-sm text-gray-400 m-0'>Loading help...</p>
					</div>
				</div>
			</Card>
		)
	}

	return (
		<Card className={`contextual-help-panel ${className}`}>
			<div className='help-header mb-4'>
				<div className='flex items-center justify-between mb-2'>
					<h5 className='text-white m-0 flex items-center gap-2'>
						<i className='pi pi-question-circle text-blue-500' />
						Contextual Help
					</h5>
					<Button
																			icon='pi pi-times'
													size='small'
													className='p-button-text p-button-sm'
						onClick={handleClose}
					/>
				</div>
			</div>

			{error && <Message severity='error' text={error} className='mb-4' />}

			{helpContent && (
				<>
					{/* Help Title and Description */}
					<div className='help-content mb-4'>
						<h6 className='text-white mb-2'>{helpContent.title}</h6>
						<p className='text-sm text-gray-400 mb-3'>
							{helpContent.description}
						</p>
					</div>

					{/* Help Steps */}
					{helpContent.steps && helpContent.steps.length > 0 && (
						<div className='help-steps mb-4'>
							<h6 className='text-sm font-medium text-white mb-3 flex items-center gap-2'>
								<i className='pi pi-list text-gray-400' />
								Steps
							</h6>
							<div className='steps-list'>
								{helpContent.steps.map((step, index) => (
									<HelpStep key={`step-${index}`} step={step} index={index} />
								))}
							</div>
						</div>
					)}

					{/* Help Actions */}
					{helpContent.actions && helpContent.actions.length > 0 && (
						<div className='help-actions mb-4'>
							<Divider />
							<h6 className='text-sm font-medium text-white mb-3 flex items-center gap-2'>
								<i className='pi pi-bolt text-gray-400' />
								Quick Actions
							</h6>
							<div className='flex flex-wrap gap-2'>
								{helpContent.actions.map((action, index) => (
									<HelpActionButton
										key={`action-${index}`}
										action={action}
										onClick={handleHelpAction}
									/>
								))}
							</div>
						</div>
					)}

					{/* Related Topics */}
					{helpContent.relatedTopics &&
						helpContent.relatedTopics.length > 0 && (
							<div className='related-topics mb-4'>
								<Divider />
								<h6 className='text-sm font-medium text-white mb-3 flex items-center gap-2'>
									<i className='pi pi-link text-gray-400' />
									Related Topics
								</h6>
								<div className='flex flex-wrap gap-2'>
									{helpContent.relatedTopics.map((topic, index) => (
										<Badge
											key={`topic-${index}`}
											value={topic}
											severity='info'
																								size='normal'
											className='cursor-pointer hover:opacity-80'
											onClick={() => {
												console.log('Related topic clicked:', topic)
												// Handle related topic navigation
											}}
										/>
									))}
								</div>
							</div>
						)}

					{/* Video Link */}
					{helpContent.videoUrl && (
						<div className='video-help mb-4'>
							<Divider />
							<div className='text-center'>
								<Button
																						label='Watch Video Tutorial'
													icon='pi pi-play'
													size='small'
													className='p-button-outlined'
									onClick={() => {
										console.log('Opening video:', helpContent.videoUrl)
										// Handle video opening
									}}
								/>
							</div>
						</div>
					)}
				</>
			)}

			{/* Refresh Button */}
			<div className='flex justify-end mt-4'>
				<Button
																		label='Refresh Help'
													icon='pi pi-refresh'
													size='small'
													className='p-button-sm p-button-text'
					onClick={loadContextualHelp}
					loading={loading}
				/>
			</div>
		</Card>
	)
}

export default ContextualHelpPanel
