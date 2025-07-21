import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passwordMatchValidator(){
    return (formGroup:AbstractControl):ValidationErrors|null=>{
        const password=formGroup?.get('password')
        const confirmPassword=formGroup?.get('confirmPassword')

        if(password!==confirmPassword){
            return {passwordMismatch:true}
        }
        return null
    }
}