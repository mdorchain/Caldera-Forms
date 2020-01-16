import React, {Fragment} from 'react';
import {NewGroupName} from "./Conditionals";
import {getFieldsUsedByConditional} from "../stateFactory";

/**
 * The section to set which fields it applies to
 *
 * @since 1.8.10
 *
 * @param Array formFields The form's fields
 * @param Array fieldsUsed The fields this conditional is applied to.
 * @param Array notAllowedFields The fields this conditional can NOT applied to.
 * @param strings Translation strings
 * @param onChange
 * @param groupId
 * @returns {*}
 * @constructor
 */
export const AppliesToFields = ({formFields, fieldsUsed, notAllowedFields, strings, onChange, groupId}) => {
    /**
     * Check if we should disable this option
     *
     * @since 1.8.10
     *
     * @param fieldId
     * @returns {*}
     */
    function isFieldDisabled(fieldId) {
        if( undefined === notAllowedFields ){
            return false;
        }
        return notAllowedFields.includes(fieldId);
    }

    /**
     * Check if field is used and should be checked.
     *
     * @since 1.8.10
     *
     * @param fieldId
     * @returns {*}
     */
    function isFieldChecked(fieldId) {
        return fieldsUsed.includes(fieldId);
    }

    return (
        <div style={{float: 'left', width: '288px', paddingLeft: '12px'}}>
            <h4 style={{borderBottom: `1px solid rgb(191, 191, 191)`, margin: `0px 0px 6px; padding: 0px 0px 6px`}}>
                {strings['applied-fields']}
            </h4>
            <p className="description">{strings['select-apply-fields']}</p>
            {formFields.map(field => (
                    <label style={{display: 'block', marginLeft: `20px`}}>
                        {field.label}
                        <input
                            style={{marginLeft: `-20px`}}
                            type="checkbox"
                            disabled={isFieldDisabled(field.ID)}
                            onClick={(e) => {
                                e.preventDefault();
                                //Is it already applied?
                                if (isFieldChecked(field.ID)) {
                                    //remove from applied fields
                                    onChange(fieldsUsed.filter(f => f.ID === field.ID))
                                } else {
                                    //Add to applied fields.
                                    onChange([...fieldsUsed, field.ID])
                                }
                            }}
                            value={groupId}
                            checked={isFieldChecked(field.ID)}
                        />
                    </label>
                )
            )}
        </div>
    );
};

const isFieldTypeWithOptions = (fieldType) => ['dropdown', 'checkbox', 'radio', 'filtered_select2', 'toggle_switch'];


/**
 * One line in a group
 *
 * @since 1.8.10
 *
 * @param line The single line of conditional rule.
 * @param {} strings Translation field
 * @param boolean isFirst
 * @param formFields
 * @param onRemoveLine
 * @param onUpdateLine
 * @returns {*}
 * @constructor
 */
export const ConditionalLine = ({line, strings, isFirst, formFields,onRemoveLine,onUpdateLine}) => {
    const {value, field, compare} = line;
    const fieldConfig = React.useMemo(() => {
        const config =  formFields.find(f => f.ID === field);
        if( config ){
            return config;
        }
        return {
            type: 'text'
        }
    }, [field]);

    /**
     * Callback for changing which field this line is based on
     *
     * @param field
     */
    const onChangeField = (field) => {
        onUpdateLine({
            field,compare,value,
        })
    };

    /**
     * Callback for changing a line's value
     *
     * @since 1.8.10
     *
     * @param value
     */
    const onChangeValue = (value) => {
        onUpdateLine({
            field,compare,value,
        })
    };

    /**
     * Callback for changing a line's comparison type
     *
     * @since 1.8.10
     *
     * @param compare
     */
    const onChangeCompare = (compare) => {
        onUpdateLine({
            field,compare,value,
        })
    };

    return (
        <div key={line.id} className={`caldera-condition-line condition-line-${line.id}`}>
            <span style={{display: "inline-block"}}>
                {isFirst ? <React.Fragment>{strings['if']}</React.Fragment> :
                    <React.Fragment>{strings['and']}</React.Fragment>}
            </span>
            <select
                style={{maxWidth: "120px", verticalAlign: 'inherit'}}
                className="condition-line-field"
                value={field}
                onChange={onChangeField}
            >
                <option/>
                <optgroup label={strings['fields']}>
                    {formFields.map(field => (
                        <option value={field.id}>
                            {field.label} [{field.slug}]
                        </option>
                    ))}
                </optgroup>
            </select>
            <select
                className="condition-line-compare"
                value={compare}
                onChange={onChangeCompare}
                style={{maxWidth: "120px", verticalAlign: 'inherit'}}
            >
                {['is', 'isnot', 'greater', 'smaller', 'startswith', 'endswith', 'contains'].map(compareType => (
                    <option key={compareType} value={compareType}>{compareType}</option>
                ))}
            </select>
            {isFieldTypeWithOptions(fieldConfig.type) ? (
                <select
                    value={value}
                    onChange={onChangeValue}
                    style={{maxWidth: "165px", verticalAlign: 'inherit'}}>
                    <option/>
                    {formFields.map(option => (
                        <option
                            key={option.value}
                            value={option.value}>
                            {option.label}
                        </option>)
                    )}

                </select>
            ) : (
                <input
                    onChange={onChangeValue}
                    value={value}
                    type="text"
                    className="magic-tag-enabled block-input"
                />
            )}
            <button
                onClick={onRemoveLine}
                className="button pull-right" type="button"
            >
                <i className="icon-join"/>
            </button>
        </div>
    );
};

/**
 * All of the lines of one conditional
 *
 * @since 1.8.10
 *
 * @param lines
 * @param strings
 * @param formFields
 * @param onRemoveLine
 * @param onUpdateLine
 * @returns {*}
 * @constructor
 */
const ConditionalLines = ({lines, strings, formFields,onRemoveLine,onUpdateLine}) => {


    return (
        <div className="caldera-condition-group caldera-condition-lines">
            {lines.map((line,index) => {
                console.log(index,line);
                return (
                    <ConditionalLine
                        line={line}
                        isFirst={0  === index }
                        { ...{
                            strings,
                            formFields,
                            onRemoveLine,
                            onUpdateLine
                        }}
                    />
                )
            })}

            <div style={{margin: "12px 0 0"}}>
                <button
                    className="button button-small condition-group-add-line"
                    type="button"
                >
                    {strings['add-condition']}
                </button>
            </div>
        </div>)
};

/**
 * One conditional
 *
 * @since 1.8.10
 */
const Conditional = ({conditional, formFields, strings, onRemoveConditional, onUpdateConditional, fieldsNotAllowed, fieldsUsed}) => {

    const { type, config,id} = conditional;
    const group = config && config.hasOwnProperty('group') ? config.group : {};
    const name = conditional.hasOwnProperty('config' ) && conditional.config.hasOwnProperty('name' ) ? conditional.config.name : '';
    const onAddLine = () => {
        const id = `cl_${Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)}`
        onUpdateConditional({
            conditional,
            config: {
                ...conditional.config,
                group: {
                    ...group,
                    [id]: {
                        field: '',
                        value: '',
                        type: ''
                    }
                }
            }
        });
    };

    /**
     * Callback for updating a line in a conditonal group
     *
     * @since 1.8.10
     *
     * @param line
     * @param lineId
     */
    const onUpdateLine = (line,lineId) => {
        let groups = group;
        const groupId  = line.parent;
        onUpdateConditional({
            ...conditional,
            config:{
                group: groups
            }
        })
    };

    /**
     *  Callback for removing a line
     *
     *  @since 1.8.10
     *
     * @param lineId
     * @param groupId
     */
    const onRemoveLine = (lineId,groupId) => {
        let groups = group;

        delete groups[groupId][lineId];
        onUpdateConditional({
            ...conditional,
            config: {
                ...conditional.config,
                group: groups
            }
        });
    };


    /**
     * Callback for updating name of conditional group
     *
     * @sicne 1.8.0
     *
     * @param name
     */
    const onUpdateName = (name) => {
        onUpdateConditional({
            ...conditional,
            config: {
                ...conditional.config,
                name,
            }
        })
    };

    /**
     * Callback for changing type of conditonal
     *
     * @sicne 1.8.0
     *
     * @param type
     * @returns {*}
     */
    const onChangeType = (type ) => {
        return onUpdateConditional({
            ...conditional,
            type
        })
    }


    return (
        <div className="caldera-editor-condition-config caldera-forms-condition-edit"
             style={{marginTop: '-27px', width: "auto"}}
        >
            {!name ? (
                <NewGroupName
                    placeholder={strings['new-group-name']}
                    id={id}
                    value={name}
                    onChange={onUpdateName}
                />
            ) : (
                <div
                    className={`condition-point-${id}`}
                    style={{float: 'left', width: "550px"}}
                >
                    <div
                        className="caldera-config-group"
                    >
                        <label htmlFor={`condition-group-name-${id}`}>
                            {strings.name}
                        </label>
                        <div
                            className="caldera-config-field"
                        >
                            <input
                                type="text"
                                name={`conditions[${id}][name]`}
                                id={`condition-group-name-${id}`}
                                value={name}
                                onChange={(e) => onUpdateName(e.target.value)}
                                required
                                className="required block-input condition-group-name"
                            />
                        </div>
                    </div>

                    <div className="caldera-config-group">
                        <label
                            htmlFor={`condition-group-type-${id}`}
                        >
                            {strings.type}
                        </label>
                        <div

                            className="caldera-config-field"
                        >
                            <select
                                value={type}
                                onChange={(e) => onChangeType(e.target.value)}
                                id={`condition-group-type-${id}`}
                                name={`conditions[${id}][type]`}
                                className="condition-group-type"
                            >
                                <option value=""/>
                                <option value="show">
                                    {strings.show}
                                </option>
                                <option value="hide">
                                    {strings.hide}
                                </option>
                                <option value="disable">
                                    {strings.disable}
                                </option>
                            </select>
                            {type &&
                            <button
                                type="button"
                                className="pull-right button button-small condition-group-add-lines"
                                onClick={onAddLine}
                            >
                                {strings['add-conditional-line']}
                            </button>
                            }
                        </div>
                    </div>
                    {Object.keys(group).map(groupId=> {
                        const lineGroups = group[groupId];
                            return (
                                <Fragment>
                                    <ConditionalLines
                                        lines={Object.values(lineGroups)}
                                        strings={strings}
                                        formFields={formFields}
                                        onUpdateLine={onUpdateLine}
                                        onRemoveLine={onRemoveLine}
                                    />
                                    <button
                                        style={{margin: "12px 0 12px"}}
                                        type="button"
                                        className="block-input button"
                                        data-confirm={strings['confirm-remove']}
                                        onClick={e => {
                                            e.preventDefault();
                                            onRemoveConditional(id)
                                        }}
                                    >
                                        {strings['remove-condition']}
                                    </button>
                                </Fragment>
                            )
                        })

                    }

                    <AppliesToFields
                        formFields={formFields}
                        fieldsUsed={fieldsUsed}
                        fieldsNotAllowed={fieldsNotAllowed}
                        strings={strings}
                        onChange={() => {
                        }}
                        groupId={id}
                    />
                </div>
            )}
        </div>
    )
};


export default Conditional;