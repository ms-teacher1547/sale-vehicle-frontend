import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import authService from '../../services/authService';

const Register = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    address: '',
    type: 'INDIVIDUAL',
    role: 'USER',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.register(userData);
      navigate('/login');
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'var(--surface)',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'var(--primary-dark)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            color: 'var(--surface)',
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            Inscription
          </h2>
          <p style={{
            color: 'var(--surface-variant)',
            fontSize: '0.9rem'
          }}>
            Créez votre compte Sale Vehicle
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {error && (
            <div style={{
              backgroundColor: 'var(--error-light)',
              color: 'var(--error)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              Nom d'utilisateur
            </label>
            <div style={{
              position: 'relative'
            }}>
              <FaUser style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} />
              <input
                type="text"
                name="username"
                value={userData.username}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingLeft: '3rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
                placeholder="Votre nom d'utilisateur"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              Mot de passe
            </label>
            <div style={{
              position: 'relative'
            }}>
              <FaLock style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={userData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingLeft: '3rem',
                  paddingRight: '3rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              Nom complet
            </label>
            <div style={{
              position: 'relative'
            }}>
              <FaUser style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} />
              <input
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingLeft: '3rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
                placeholder="Votre nom complet"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              Email
            </label>
            <div style={{
              position: 'relative'
            }}>
              <FaEnvelope style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingLeft: '3rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              Adresse
            </label>
            <div style={{
              position: 'relative'
            }}>
              <FaMapMarkerAlt style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} />
              <input
                type="text"
                name="address"
                value={userData.address}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingLeft: '3rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
                placeholder="Votre adresse"
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 'bold'
            }}>
              Type de compte
            </label>
            <div style={{
              position: 'relative'
            }}>
              <FaBuilding style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} />
              <select
                name="type"
                value={userData.type}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  paddingLeft: '3rem',
                  borderRadius: '8px',
                  border: '2px solid var(--border)',
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  appearance: 'none'
                }}
              >
                <option value="INDIVIDUAL">Particulier</option>
                <option value="COMPANY">Entreprise</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'var(--primary-main)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s ease'
            }}
          >
            {isLoading ? (
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid var(--surface)',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            ) : (
              <>
                <FaUserPlus />
                S'inscrire
              </>
            )}
          </button>

          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }}>
            Déjà un compte ?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--primary-main)',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
