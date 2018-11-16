import React, {Component} from 'react'

import form from './styles/form.css'
import flex from './styles/flex.css'

import SaveButton from './SaveButton'
import FormButton from './FormButton'
import InputGroup from './InputGroup';

export default class StyleSettings extends Component {
    constructor(props) {
        super(props);
        let errors = {"formError": props.editMode ? "" : "Above Values Are Not Stored in the DB"}
        for (let defaultValue in props.defaultValues) {
            errors[defaultValue] = '';
        }
        this.state = {
            editMode: props.editMode,
            submitting: false,
            updated: false,
            saved: false,
            initialState : {
                ...props.defaultValues
            },
            fields: {
                ...props.defaultValues
            },
            currentForm: props.currentForm,
            errors   
        }

        this.handleButtonClick=this.handleButtonClick.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.renderInputs = this.renderInputs.bind(this)
        this.handleUnload=this.handleUnload.bind(this)
    }

    // NEED TO HANDLE UPDATES TO STATE OUTSIDE OF THIS COMPONENT SOMEHOW !!!
    static getDerivedStateFromProps(nextProps, prevState) {
        console.info("Here We Go!")
        const {styleSettings, displayMode} = nextProps
        const newSettings = styleSettings ? JSON.stringify(styleSettings) : "";
        const oldSettings = prevState.styleSettings ? JSON.stringify(prevState.styleSettings) : "";

        if (displayMode !== prevState.displayMode) {
            const newDefaults = nextProps.defaultValues ? JSON.stringify(nextProps.defaultValues) : "";
            const oldDefaults = prevState.defaultValues ? JSON.stringify(prevState.defaultValues) : "";
            const errors = {
                formError: nextProps.editMode ? "" : "Above Values Are Not Stored in the DB"
            }
            for (let defaultValue in nextProps.defaultValues) {
                errors[defaultValue] = '';
            }
            if (oldDefaults !== newDefaults) {
                console.info('New Defaults')
                return {
                    editMode: nextProps.editMode,
                    submitting: false,
                    updated: false,
                    saved: false,
                    initialState: {...nextProps.defaultValues},
                    fields: {...nextProps.defaultValues},
                    currentForm: nextProps.currentForm,
                    styleSettings: nextProps.styleSettings,
                    displayMode: nextProps.displayMode,
                    errors, 
                }
            } else {
                console.info("No New Defaults, Should never get here")
                return null
            }
        } 
        if (newSettings !== oldSettings) {
            console.info('New Settings')
            return {
                saved: nextProps.styleSettings.saved,
                updated: nextProps.styleSettings.updated,
                submitting: nextProps.styleSettings.submitting,
                fields: {...nextProps.styleSettings.fields},
                errors: {...nextProps.styleSettings.errors},
                styleSettings: nextProps.styleSettings,
            }
        } else {
            console.info("No New Settings and No New Defaults")
            return null
        }
    }

    // don't let users leave page without warning
    componentDidMount() {
        window.addEventListener('beforeunload', this.handleUnload)
    }
    // remove event listeners on unmount
    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleUnload)
    }

    handleUnload(e) {
        // console.log({updated: this.state.updated, saved: this.state.saved})
        if (this.state.updated && !this.state.saved) {
            e.preventDefault();
            e.returnValue = "Are you sure you want to go back?\n You may lose all your changes to this page."
            return "Are you sure you want to go back?\n You may lose all your changes to this page."
        }
        return void (0);
    }

    handleButtonClick(ctx) {
        this.props.tabFunctions.handleStyleButtonClick(ctx, this.state.fields, this.state.errors, this.state.currentForm.form_status)
    }

    handleInputChange(e) {
        const target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const fields = {...this.state.fields}
        const errors = {...this.state.errors};
        const error = '';
        errors[name] = error;     
        fields[name] = value;
        const updated = JSON.stringify(fields) !== JSON.stringify(this.state.initialState)
        this.props.tabFunctions.handleStyleInputChange(fields, errors, updated)
    }

    renderInputs(fields, errors) {
        const fieldNames = Object.keys(fields);
        const groups = fieldNames.reduce((acc, name) => {
            const fieldGroup = name.substring(2).split("-")[0];
            if ( !acc[fieldGroup] ) {
                acc[fieldGroup] = [name]
            } else {
                acc[fieldGroup].push(name)
            }
            return acc
        }, {})
        const returnArray = [];
        for ( let group in groups) {
            returnArray.push(groups[group].map((field, ind)=>{
                return (
                    <div key={`${group}-${ind}`} styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center flex.flex-wrap">
                        <InputGroup
                            type="text"
                            id={field}
                            specialStyle="" 
                            label={field.includes('externalFont') ? field : field.substring(2)}
                            placeholder="CSS"
                            maxLength={32} 
                            required={true} 
                            value={fields[field]} 
                            handleInputChange={this.handleInputChange} 
                            error={errors[field]} 
                        />
                        { 
                            this.props.displayMode === "Colors" ? (
                                <div style={{border: "1px solid #ccc", height: "28px", width: "28px", backgroundColor: fields[field]}}></div>
                            ) : null
                        }
                    </div>
                )
            }));
        }
        return returnArray.map((arr, i)=>{
            return (
                <fieldset key={`groups-${i}`} styleName='form.fieldset__bordered'>
                    {arr}
                </fieldset>
            )
        })
    }
   
    render() {
        const { fields, errors } = this.state;
        let title = this.props.displayMode == "Spacing" ? "Spacing" : this.props.displayMode.slice(0, -1);
        return (
            <React.Fragment>
                <form onSubmit={(e)=>{e.preventDefault(); this.handleButtonClick({name: "store", val: '', type: 'css_setup'})}}>
                    <h3>Configure {title} Setttings</h3>
                    <fieldset styleName="form.fieldset">
                        {this.renderInputs(fields, errors)}
                        {
                            this.props.displayMode === "Fonts" ? (
                                <div styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center">
                                    <div style={{maxWidth: "225px"}}>
                                        <FormButton val="Add External Font" handleClick={this.handleButtonClick} ctx={{name: "externalFonts", val: '', type: 'Add'}} />
                                    </div>
                                </div>
                            ) : null
                        }
                    </fieldset>

                    <SaveButton 
                        handleClick={this.handleButtonClick} 
                        submitting={this.state.submitting} 
                        ctx={{name: "store", val: '', type: 'css_setup'}} 
                        error={errors.formError} 
                        formMsg={this.state.updated && !this.state.saved ? "Changes require saving": ''}
                    />
                 </form>
            </React.Fragment>
        )
    }
}