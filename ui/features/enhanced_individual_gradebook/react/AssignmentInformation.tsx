/*
 * Copyright (C) 2023 - present Instructure, Inc.
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

import React from 'react'
import {View} from '@instructure/ui-view'
import {useScope as useI18nScope} from '@canvas/i18n'
import {AssignmentConnection, SubmissionConnectionResponse} from '../types'

const I18n = useI18nScope('enhanced_individual_gradebook')

type Props = {
  assignment?: AssignmentConnection
  submissions?: SubmissionConnectionResponse[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function AssignmentInformation({assignment, submissions}: Props) {
  return (
    <View as="div">
      <View as="div" className="row-fluid">
        <View as="div" className="span4">
          <View as="h2">{I18n.t('Assignment Information')}</View>
        </View>
        <View as="div" className="span8 pad-box top-only">
          <View as="p" className="submission_selection">
            {I18n.t('Select an assignment to view additional information here.')}
          </View>
        </View>
      </View>
    </View>
  )
}
