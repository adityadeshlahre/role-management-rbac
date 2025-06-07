export interface CommonButtonProps {
  children: React.ReactNode;
}

const CommonButton: React.FC<CommonButtonProps> = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

export default CommonButton;
