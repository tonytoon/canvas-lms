/*
 * Copyright (C) 2021 - present Instructure, Inc.
 *
 * This file is part of Canvas.
 *
 * Canvas is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * Canvas is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import I18n from 'i18n!discussion_posts'

import DateHelper from '../../../../../shared/datetime/dateHelper'
import PropTypes from 'prop-types'
import React, {useMemo, useState} from 'react'
import {responsiveQuerySizes} from '../../utils/index'

import {Text} from '@instructure/ui-text'
import {Flex} from '@instructure/ui-flex'
import {View} from '@instructure/ui-view'
import {Tray} from '@instructure/ui-tray'
import {CloseButton, CondensedButton} from '@instructure/ui-buttons'
import {Responsive} from '@instructure/ui-responsive'
import {DueDateTray} from '../DueDateTray/DueDateTray'
import {InlineList} from '@instructure/ui-list'

export function AssignmentDueDate({...props}) {
  const [dueDateTrayOpen, setDueDateTrayOpen] = useState(false)
  let dueAt = ''
  let mobileDueAt = ''

  let assignmentOverrides = props.discussionTopic?.assignment?.assignmentOverrides?.nodes || []

  const canSeeMultipleDueDates = !!(
    props.discussionTopic.permissions?.readAsAdmin && assignmentOverrides.length > 0
  )

  const defaultDateSet =
    !!props.discussionTopic.assignment?.dueAt ||
    !!props.discussionTopic.assignment?.lockAt ||
    !!props.discussionTopic.assignment?.unlockAt

  const singleOverrideWithNoDefault = !defaultDateSet && assignmentOverrides.length === 1

  const getTitle = (group, isAdmin) => {
    if (group) {
      return group
    } else {
      return isAdmin ? I18n.t('Everyone') : null
    }
  }

  const getDueDate = dueDate => {
    if (dueDate) {
      return I18n.t('Due %{date}', {
        date: dueDate
      })
    }
    return I18n.t('No Due Date')
  }

  const getAvailableFromUntilDate = (availableDate, untilDate) => {
    if (availableDate && untilDate) {
      return I18n.t('Available from %{availableDate} until %{untilDate}', {
        availableDate,
        untilDate
      })
    } else if (availableDate) {
      return I18n.t('Available from %{availableDate}', {
        availableDate
      })
    } else if (untilDate) {
      return I18n.t('Available until %{untilDate}', {
        untilDate
      })
    }
    return null
  }

  const processDueDate = (group, dueDate, availableDate, untilDate) => {
    return (
      <InlineList delimiter="none">
        {[
          getTitle(group, props.discussionTopic.permissions?.readAsAdmin),
          getDueDate(dueDate),
          getAvailableFromUntilDate(availableDate, untilDate)
        ]
          .filter(item => item !== null)
          .map(item => (
            <InlineList.Item key={`assignement-due-date-section-${item.slice(0, 5)}`}>
              <Text>{item}</Text>
            </InlineList.Item>
          ))}
      </InlineList>
    )
  }

  const getMobileDueDate = dueDate => {
    if (dueDate) {
      return (
        <Text>
          {I18n.t('Due %{date}', {
            date: dueDate
          })}
        </Text>
      )
    }
    return <Text>{I18n.t('No Due Date')}</Text>
  }

  if (props.discussionTopic.assignment) {
    if (assignmentOverrides.length > 0 && canSeeMultipleDueDates && defaultDateSet) {
      assignmentOverrides = assignmentOverrides.concat({
        dueAt: props.discussionTopic.assignment?.dueAt,
        unlockAt: props.discussionTopic.assignment?.unlockAt,
        lockAt: props.discussionTopic.assignment?.lockAt,
        title: I18n.t('Everyone Else'),
        id: props.discussionTopic.assignment?.id
      })
    }

    dueAt = singleOverrideWithNoDefault
      ? processDueDate(
          assignmentOverrides[0]?.title,
          DateHelper.formatDatetimeForDiscussions(assignmentOverrides[0]?.dueAt),
          DateHelper.formatDateForDisplay(assignmentOverrides[0]?.unlockAt, 'short'),
          DateHelper.formatDateForDisplay(assignmentOverrides[0]?.lockAt, 'short')
        )
      : processDueDate(
          '',
          DateHelper.formatDatetimeForDiscussions(props.discussionTopic.assignment?.dueAt),
          DateHelper.formatDateForDisplay(props.discussionTopic.assignment?.unlockAt, 'short'),
          DateHelper.formatDateForDisplay(props.discussionTopic.assignment?.lockAt, 'short')
        )

    mobileDueAt = getMobileDueDate(
      singleOverrideWithNoDefault
        ? DateHelper.formatDateForDisplay(assignmentOverrides[0]?.dueAt, 'short')
        : DateHelper.formatDateForDisplay(props.discussionTopic.assignment?.dueAt, 'short')
    )
  }

  const singleDueDate = useMemo(
    () => (
      <Responsive
        match="media"
        query={responsiveQuerySizes({tablet: true, desktop: true})}
        props={{
          tablet: {
            textSize: 'x-small',
            displayText: mobileDueAt
          },
          desktop: {
            textSize: 'small',
            displayText: dueAt
          }
        }}
        render={responsiveProps => (
          <Text weight="normal" size={responsiveProps.textSize}>
            {responsiveProps.displayText}
          </Text>
        )}
      />
    ),
    [dueAt, mobileDueAt]
  )

  const multipleDueDates = useMemo(
    () => (
      <>
        <CondensedButton
          onClick={() => {
            setDueDateTrayOpen(true)
          }}
          data-testid="show-due-dates-button"
        >
          <Responsive
            match="media"
            query={responsiveQuerySizes({tablet: true, desktop: true})}
            props={{
              tablet: {
                text: I18n.t('Due Dates (%{dueDateCount})', {
                  dueDateCount: assignmentOverrides.length
                }),
                textSize: 'x-small'
              },
              desktop: {
                text: I18n.t('Show Due Dates (%{dueDateCount})', {
                  dueDateCount: assignmentOverrides.length
                }),
                textSize: 'small'
              }
            }}
            render={responsiveProps => (
              <Text weight="bold" size={responsiveProps.textSize}>
                {responsiveProps.text}
              </Text>
            )}
          />
        </CondensedButton>
        <Tray open={dueDateTrayOpen} size="large" placement="end" label="Due Dates">
          <View as="div" padding="medium">
            <Flex direction="column">
              <Flex.Item>
                <CloseButton
                  placement="end"
                  offset="small"
                  screenReaderLabel="Close"
                  onClick={() => {
                    setDueDateTrayOpen(false)
                  }}
                />
              </Flex.Item>
              <Flex.Item padding="none none medium none" shouldGrow shouldShrink>
                <Text size="x-large" weight="bold" data-testid="due-dates-tray-heading">
                  {I18n.t('Due Dates')}
                </Text>
              </Flex.Item>
              <DueDateTray assignmentOverrides={assignmentOverrides} />
            </Flex>
          </View>
        </Tray>
      </>
    ),
    [dueDateTrayOpen, assignmentOverrides]
  )

  return canSeeMultipleDueDates && assignmentOverrides.length > 1 ? multipleDueDates : singleDueDate
}

AssignmentDueDate.propTypes = {
  discussionTopic: PropTypes.object
}
