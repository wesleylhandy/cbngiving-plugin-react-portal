import React from 'react'

import form from './styles/form.css'
import flex from './styles/flex.css'

import SaveButton from './SaveButton'
import FormButton from './FormButton'
import Checkbox from './Checkbox'
import RadioButton from './RadioButton'
import InputGroup from './InputGroup'
import SelectGroup from './SelectGroup'
import withFormConfigHandling from './withFormConfigHandling'

const GivingSettings = ({ fields, errors, handleButtonClick, handleInputChange, handleRadioClick, updated, submitting, saved }) => {

    const renderAmtInputs = (type, arr) => {
        // console.log({type, arr})
        return arr.map((amt, ind)=>{
            // console.log(el)
            return (
                <div key={`${type}Input-${ind}`} styleName="flex.flex flex.flex-row flex.flex-axes-center flex.flex-grow">
                    <InputGroup
                        type="text"
                        id={`${type}Amt-${ind}`} 
                        specialStyle="" 
                        label={`Amount ${ind+1}`}
                        placeholder="Whole #, no $" 
                        required={true} 
                        validation="[1-9]+\d*"
                        value={amt} 
                        handleInputChange={handleInputChange} 
                        error={errors[`${type}Amt-${ind}`]} 
                    />
                    <div>
                        <FormButton val="Remove" handleClick={handleButtonClick} ctx={{name: "giving", val: {type, ind}, type: 'Remove'}} />
                    </div>
                </div>
            )
        })
    }

    const renderDefaultSelect = (option) => {

        const amounts = option === "monthly" ? fields.monthlyAmounts : fields.singleAmounts;

        const options = amounts.map((amt, ind) => {
            return <option key={`amt-option-${ind}`} value={amt}>{amt}</option>
        })

        return (
            <SelectGroup 
                id="defaultAmount"
                label="Default Amount"
                specialStyle=""
                required={false}
                value={fields.defaultAmount}
                error={errors.defaultAmount}
                handleInputChange={handleInputChange}
                options={options}
            />
        ) 
    }

    const renderGivingOptions = type => {
        return (
            <div styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center flex.flex-wrap">
                <InputGroup
                    type="text"
                    id={`${type}-DetailName`} 
                    specialStyle="" 
                    label={`Detail Name`}
                    maxLength={32}
                    placeholder="i.e. Superbook, OrphansPromise, 700Club, etc" 
                    required={true} 
                    value={type == "monthlyPledgeData" ? "MP" : "SPGF"}
                    handleInputChange={()=>{}} 
                    error=""
                    disabled={true}
                />
                <InputGroup
                    type="text"
                    id={`type-DetailDescription`} 
                    specialStyle="" 
                    label={`SOL Description`}
                    maxLength={32}
                    placeholder="i.e. Orphan's Promise Vietname, Superbook Translation, etc" 
                    required={true} 
                    value={type == "monthlyPledgeData" ? "Monthly Pledge" : "Single Pledge"}
                    handleInputChange={()=>{}} 
                    error=""
                    disabled={true}
                />
                <InputGroup
                    type="text"
                    id={`type-DetailCprojMail`} 
                    specialStyle="" 
                    label={`WhiteMail SOL`}
                    maxLength={6}
                    placeholder="i.e. 043251" 
                    required={true} 
                    value={fields[type].DetailCprojMail} 
                    handleInputChange={handleInputChange} 
                    error={errors[type].DetailCprojMail} 
                />
                <InputGroup
                    type="text"
                    id={`type-DetailCprojCredit`} 
                    specialStyle="" 
                    label={`Credit SOL`}
                    maxLength={6}
                    placeholder="i.e. 043250" 
                    required={true} 
                    value={fields[type].DetailCprojCredit} 
                    handleInputChange={handleInputChange} 
                    error={errors[type].DetailCprojCredit} 
                />
            </div>
        )
    }

    return (
        <React.Fragment>
            <form onSubmit={(e)=>{e.preventDefault(); handleButtonClick({name: "store", val: '', type: 'form_setup'})}}>
                <h3>Configure Giving Setttings</h3>
                <fieldset styleName="form.fieldset">
                    <div styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center">
                        <Checkbox id="showGivingArray" checked={fields.showGivingArray} handleInputChange={handleInputChange} label="Show Giving Array(s)?"/>
                    </div>

                    {
                        fields.showGivingArray ? (
                            <React.Fragment>
                                <div styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center">
                                    <Checkbox id="monthlyOption" checked={fields.monthlyOption} handleInputChange={handleInputChange} label="Show Monthly Giving Options?"/>
                                </div>

                                { 
                                    fields.monthlyOption ? (
                                        <fieldset styleName="form.fieldset__bordered">
                                            <h3>Monthly Pledge Settings</h3>
                                            {
                                                renderGivingOptions("monthlyPledgeData")
                                            }
                                            <div styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center flex.flex-wrap">
                                                { renderAmtInputs("monthly", fields.monthlyAmounts) }
                                            </div>
                                            <div styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center">
                                                <div style={{maxWidth: "170px"}}>
                                                    <FormButton val="Add Setting" handleClick={handleButtonClick} ctx={{name: "giving", val: 'monthly', type: 'Add'}} />
                                                </div>
                                            </div>
                                        </fieldset>
                                    ) : null
                                }

                                <div styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center">
                                    <Checkbox id="singleOption" checked={fields.singleOption} handleInputChange={handleInputChange} label="Show Single Giving Options"/>
                                </div>

                                { 
                                    fields.singleOption ? (
                                        <fieldset styleName="form.fieldset__bordered">
                                            <h3>Single Pledge Settings</h3>
                                            {
                                                renderGivingOptions("singlePledgeData")
                                            }
                                            <div styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center flex.flex-wrap">
                                                { renderAmtInputs("single", fields.singleAmounts) }
                                            </div>
                                            <div styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center">
                                                <div style={{maxWidth: "170px"}}>
                                                    <FormButton val="Add Setting" handleClick={handleButtonClick} ctx={{name: "giving", val: 'single', type: 'Add'}} />
                                                </div>
                                            </div>
                                        </fieldset>
                                    ) : null
                                }

                                {
                                    fields.singleOption && fields.monthlyOption ? (
                                        <React.Fragment>
                                            <h3>Choose Default Option</h3>
                                            <p styleName="form.form-info">No default option is required.</p>
                                            <div styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center">
                                                
                                                <div styleName="flex.flex flex.flex-row flex.flex-between form.monthly-radio">
                                                    <RadioButton id="monthlygift" name="monthly-toggle" label="Monthly Gift" checked={fields.defaultOption === "monthly"} handleRadioClick={handleRadioClick}/>
                                                    <RadioButton id="singlegift" name="monthly-toggle" label="Single Gift" checked={fields.defaultOption === "single"} handleRadioClick={handleRadioClick}/>
                                                    <RadioButton id="nullgift" name="monthly-toggle" label="No Default Option" checked={fields.defaultOption === ""} handleRadioClick={handleRadioClick}/>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ) : null
                                }

                                {
                                    fields.defaultOption !== '' ? (
                                        <React.Fragment>
                                            <h3>Select Default Amount</h3>
                                            <p styleName="form.form-info">No default Amount is required. However, if the default amount is not found within the default Giving Options, no default will be set.</p>
                                            <div styleName="form.form-row flex.flex flex.flex-row flex.flex-axes-center">
                                                { renderDefaultSelect( fields.defaultOption ) }
                                            </div>
                                        </React.Fragment>
                                    ) : null
                                }

                            </React.Fragment>
                        ) : null
                    }
                </fieldset>
                <fieldset styleName="form.fieldset">
                    <div style={{maxWidth: "88px"}}>
                        <SaveButton 
                            handleClick={handleButtonClick} 
                            submitting={submitting} 
                            ctx={{name: "store", val: '', type: 'form_setup'}} 
                            error={errors.formError} 
                            formMsg={updated && !saved ? "Changes require saving": ''}
                        />
                    </div>
                </fieldset>
            </form>
        </React.Fragment>
    )
}

export default withFormConfigHandling(GivingSettings);