import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import USER_ID from '@salesforce/user/Id';
import FIRSTNAME_FIELD from '@salesforce/schema/User.FirstName';
import ELIGIBILITY_FIELD from '@salesforce/schema/User.Contact.Summer_Fall_2022_Reg_Eligibility__c';

const fields = [FIRSTNAME_FIELD, ELIGIBILITY_FIELD];

export default class CommunityMemberBadge extends LightningElement {
	@api memberLabel;
	@api familyMemberLabel;
	@api sldsIconName;
	@api backgroundColor;
	@api labelColor;
	
	isloading = false;
	error;

	name;
	regEligibility;

	@wire(getRecord, {
        recordId: USER_ID,
        fields: fields
    }) wireuser({
        error,
        data
    }) {
        if (error) {
           this.error = error ; 
        } else if (data) {
            this.name = data.fields.FirstName.value;
			this.regEligibility = getFieldValue(data, ELIGIBILITY_FIELD);
        }
    }

	get badgeLabel() {
		let label = '';
		if (this.regEligibility != null) {
			if (this.regEligibility == 'Member') {
				label = this.memberLabel;
			} else if (this.regEligibility == 'Family Member') {
				label = this.familyMemberLabel;
			}
		}
		return label;
	}

	get hasMemberStatus() {
		return this.badgeLabel != null && this.badgeLabel != '' ? true : false;
	}

	get badgeBackgroundColor() {
		let backgroundStyle = '--sds-c-badge-color-background: ';
		backgroundStyle += this.backgroundColor != null ? this.backgroundColor : 'rgba(26, 166, 84, 1)';
		return backgroundStyle;
	}

	get badgeLabelColor() {
		let color = this.labelColor != null ? this.labelColor : 'rgba(255, 255, 255, 1)';
		let labelStyle = '--sds-c-badge-text-color:' + color + ';--slds-c-badge-icon-color-foreground:' + color;
		return labelStyle;
	}
	
}