import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-elevation',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary shadow-elevation',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-primary hover:bg-primary/10 focus:ring-primary',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent shadow-elevation'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
  const buttonStyles = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`;
  
  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 24 : 18;
  
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={buttonStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ApperIcon name="Loader2" className={`w-${iconSize/4} h-${iconSize/4} animate-spin mr-2`} />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <ApperIcon name={icon} className={`w-${iconSize/4} h-${iconSize/4} ${children ? 'mr-2' : ''}`} />
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <ApperIcon name={icon} className={`w-${iconSize/4} h-${iconSize/4} ${children ? 'ml-2' : ''}`} />
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;