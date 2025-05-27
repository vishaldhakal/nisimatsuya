import PersonalInformation from "./PersonalInformation";
import ShippingAddress from "./ShippingAddress";
import PaymentMethod from "./PaymentMethod";

export default function CheckoutForm({ 
  formData, 
  formErrors, 
  onInputChange, 
  onSubmit, 
  isSubmitting 
}) {
  return (
    <form onSubmit={onSubmit}>
      <PersonalInformation 
        formData={formData}
        formErrors={formErrors}
        onInputChange={onInputChange}
      />
      <ShippingAddress 
        formData={formData}
        formErrors={formErrors}
        onInputChange={onInputChange}
      />
      <PaymentMethod 
        formData={formData}
        formErrors={formErrors}
        onInputChange={onInputChange}
      />
    </form>
  );
}