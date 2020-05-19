class Authorizer
  def initialize(user)
    @user = user
  end

  def can?(action, subject)
    if subject.is_a?(List)
      if action == :read
        return subject.public || is_owner?(subject)
      elsif action == :write
        return is_owner?(subject)
      else
        raise "Unexpected action: #{action}"
      end
    else
      raise "Unexpected type: #{subject.class}"
    end
  end

  private

  def is_owner?(subject)
    !@user.nil? && @user == subject.user
  end
end
