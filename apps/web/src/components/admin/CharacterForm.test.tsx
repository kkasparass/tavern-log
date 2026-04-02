import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { CharacterForm, type CharacterFormData } from './CharacterForm'
import { CharacterStatus } from '@/lib/types'
import { THEME_PRESETS } from '@/lib/constants'

vi.mock('next/link')

function renderForm(props: Partial<React.ComponentProps<typeof CharacterForm>> = {}) {
  const onSubmit = vi.fn()
  render(
    <CharacterForm
      onSubmit={onSubmit}
      isPending={false}
      submitLabel="Save"
      {...props}
    />
  )
  return { onSubmit }
}

describe('CharacterForm', () => {
  it('renders all fields', () => {
    renderForm()
    expect(screen.getByLabelText('Name *')).toBeInTheDocument()
    expect(screen.getByLabelText('System *')).toBeInTheDocument()
    expect(screen.getByLabelText('Campaign')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
    expect(screen.getByLabelText('Bio')).toBeInTheDocument()
    expect(screen.getByLabelText('Personality')).toBeInTheDocument()
    expect(screen.getByLabelText('Thumbnail URL')).toBeInTheDocument()
    expect(screen.getByLabelText('Public')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    for (const preset of THEME_PRESETS) {
      expect(screen.getByRole('button', { name: new RegExp(preset.label) })).toBeInTheDocument()
    }
  })

  it('pre-fills fields from defaultValues', () => {
    renderForm({
      defaultValues: {
        name: 'Mira Ashveil',
        system: 'D&D 5e',
        campaign: 'The Shattered Crown',
        status: CharacterStatus.RETIRED,
        bio: 'A former court mage.',
        tags: ['mage', 'retired'],
      },
    })
    expect(screen.getByLabelText('Name *')).toHaveValue('Mira Ashveil')
    expect(screen.getByLabelText('System *')).toHaveValue('D&D 5e')
    expect(screen.getByLabelText('Campaign')).toHaveValue('The Shattered Crown')
    expect(screen.getByLabelText('Status')).toHaveValue(CharacterStatus.RETIRED)
    expect(screen.getByLabelText('Bio')).toHaveValue('A former court mage.')
    expect(screen.getByText('mage')).toBeInTheDocument()
    expect(screen.getByText('retired')).toBeInTheDocument()
  })

  it('calls onSubmit with correct data when submitted', async () => {
    const { onSubmit } = renderForm()
    await userEvent.type(screen.getByLabelText('Name *'), 'Nara Solis')
    await userEvent.type(screen.getByLabelText('System *'), 'Blades in the Dark')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    const submitted: CharacterFormData = onSubmit.mock.calls[0][0]
    expect(submitted.name).toBe('Nara Solis')
    expect(submitted.system).toBe('Blades in the Dark')
    expect(submitted.theme).toEqual(THEME_PRESETS[0].theme)
  })

  it('adds a tag and shows it as a chip', async () => {
    renderForm()
    await userEvent.type(screen.getByLabelText('Tag input'), 'scoundrel')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getByText('scoundrel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Remove tag scoundrel' })).toBeInTheDocument()
  })

  it('adds a tag on Enter key', async () => {
    renderForm()
    await userEvent.type(screen.getByLabelText('Tag input'), 'scoundrel{Enter}')
    expect(screen.getByText('scoundrel')).toBeInTheDocument()
  })

  it('removes a tag chip with the × button', async () => {
    renderForm({ defaultValues: { tags: ['mage', 'retired'] } })
    await userEvent.click(screen.getByRole('button', { name: 'Remove tag mage' }))
    expect(screen.queryByText('mage')).not.toBeInTheDocument()
    expect(screen.getByText('retired')).toBeInTheDocument()
  })

  it('ignores empty tag input', async () => {
    renderForm()
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('ignores duplicate tags', async () => {
    renderForm({ defaultValues: { tags: ['mage'] } })
    await userEvent.type(screen.getByLabelText('Tag input'), 'mage')
    await userEvent.click(screen.getByRole('button', { name: 'Add' }))
    expect(screen.getAllByText('mage')).toHaveLength(1)
  })

  it('selects a theme preset', async () => {
    const { onSubmit } = renderForm()
    await userEvent.type(screen.getByLabelText('Name *'), 'Test')
    await userEvent.type(screen.getByLabelText('System *'), 'D&D 5e')
    await userEvent.click(screen.getByRole('button', { name: /Ember/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce())
    const submitted: CharacterFormData = onSubmit.mock.calls[0][0]
    expect(submitted.theme).toEqual(THEME_PRESETS[1].theme)
  })

  it('shows an error message when error prop is set', () => {
    renderForm({ error: 'Failed to save changes.' })
    expect(screen.getByText('Failed to save changes.')).toBeInTheDocument()
  })

  it('disables the submit button when isPending', () => {
    renderForm({ isPending: true })
    expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled()
  })
})
